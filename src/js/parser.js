var table = new Array();
var structures = new Array();
let line = 1;

function functionDeclaration(parsedCode){
    //clearTable();
    reset();
    let code = parsedCode.body['0'];
    functionRunner(code);
    return table;
}

function reset(){
    table = new Array();
    structures = new Array();
    line=1;
}

function pushEntryProperties(line,type,name,condition,value){
    let entry = {line:line ,type : type ,name : name ,condition : condition ,value : value };
    table.push(entry);
}

var typeToHandlerMapping = {
    'FunctionDeclaration': functionDeclarationHandler,
    'VariableDeclaration': variableDeclarationHandler,
    'ExpressionStatement': expressionStatementHandler,
    'WhileStatement': whileStatementHandler,
    'ForStatement': forStatementHandler,
    'IfStatement': ifStatementHandler,
    'ReturnStatement': returnStatementHandler,
    'BlockStatement': blockStatementHandler
};

function functionDeclarationHandler(declaration) {
    pushEntryProperties(line,declaration.type,declaration.id.name,null,null);
    structures.push(declaration);
    params(declaration.params);
    line++;
    functionRunner(declaration.body);
}

function variableDeclarationHandler(declaration) {
    declaration.declarations.forEach(function(element) {
        variableDeclarator(element);
    });
    structures.push(declaration);
}

function expressionStatementHandler(declaration) {
    let expression=declaration.expression;
    if(expression.type=='SequenceExpression'){
        expression.expressions.forEach(function(element) {
            checkExpression(element);
        });
    }
    else
        checkExpression(expression);
    structures.push(expression);
}

function whileStatementHandler(declaration) {
    let test =  expressionDeclaration(declaration.test);
    pushEntryProperties(line,declaration.type,null,test,null);
    structures.push(declaration);
    line++;
    functionRunner(declaration.body);
}

function forStatementHandler(declaration) {
    let init = expressionDeclaration(declaration.init);
    let test = expressionDeclaration(declaration.test);
    let update = expressionDeclaration(declaration.update);
    let forExp = init + ';' + test + ';' + update;
    pushEntryProperties(line,declaration.type,null,forExp,null);
    structures.push(declaration);
    functionRunner(declaration.body);
}

function ifStatementHandler(declaration) {
    ifStatement(declaration,0);
}

function blockStatementHandler(block) {
    block.body.forEach(function(element) {
        functionRunner(element);
        line++;
    });
}

function returnStatementHandler(declaration) {
    let returnValue = expressionDeclaration(declaration.argument);
    pushEntryProperties(line,declaration.type,null,null,returnValue);
    structures.push(declaration);
}

function functionRunner(program) {
    let name= program.type;
    let func = typeToHandlerMapping[name];
    return func ? func.call(undefined, program) : null;
}

function params(params) {
    params.forEach(function(element) {
        pushEntryProperties(line,'FunctionParameter',element.name,null,null);
    });
}

function variableDeclarator(element){
    return pushEntryProperties(line,element.type,element.id.name,null,null);
}

function checkExpression(expression){
    if(expression.type=='AssignmentExpression')
        assignmentDeclaration(expression);
    else //if(expression.type=='UpdateExpression')
        updateDeclaration(expression);
}

function updateDeclaration(expression){
    let name = expression.argument.name;
    let value;
    if(expression.prefix)
        value = expression.operator + expressionDeclaration(expression.argument);
    else
        value = expressionDeclaration(expression.argument)+ expression.operator;
    pushEntryProperties(line,expression.type,name,null,value);
}

function assignmentDeclaration(expression){
    let name = expression.left.name;
    let value='';
    if(expression.operator == '=')
        value = expressionDeclaration(expression.right);
    else
        value = name + expression.operator + expressionDeclaration(expression.right);
    pushEntryProperties(line,expression.type,name,null,value);
}

function expressionDeclaration(expression){
    //basic
    if (expression.type=='Identifier')
        return expression.name;
    else if(expression.type=='Literal')
        return expression.raw;
    else
        return singleCharExpression(expression);
}

function ComplexExpression(expression){
    if(expression.type=='SequenceExpression'){
        let res='';
        expression.expressions.forEach(function(element) {
            res += ',' + expressionDeclaration(element);
        });
        return res.substring(1);
    }
    else /*if(expression.type=='LogicalExpression' || expression.type=='BinaryExpression' || expression.type=='AssignmentExpression')*/
        return expressionDeclaration(expression.left) + expression.operator + expressionDeclaration(expression.right);
    /* else
        return singleCharExpression(expression);*/
}

function singleCharExpression(expression){
    if(expression.type=='UpdateExpression'){
        if(expression.prefix)
            return expression.operator + expressionDeclaration(expression.argument);
        else
            return expressionDeclaration(expression.argument)+ expression.operator;
    }
    else if(expression.type=='UnaryExpression')
        return expression.operator + expressionDeclaration(expression.argument);
    else if(expression.type=='MemberExpression')
        return memberExpression(expression.object,expression.property);
    else
        return ComplexExpression(expression);

}

function memberExpression(object,property) {
    let propertyHandler;
    if(property.type == 'MemberExpression')
        propertyHandler='['+ memberExpression(property.object,property.property)+ ']';
    else //if(property.type=='Identifier')
        propertyHandler='['+expressionDeclaration(property)+']';
    return object.name+propertyHandler;
}

function ifStatement(declaration,isAlternate){
    let test = expressionDeclaration(declaration.test);
    let name= declaration.type;
    if(isAlternate)
        name = 'Else' + name;
    pushEntryProperties(line,name,null,test,null);
    structures.push(declaration);
    line++;
    functionRunner(declaration.consequent);
    if (declaration.alternate!= null) {
        line++;
        alternate(declaration.alternate);
    }
}

function alternate(alternate){
    if(alternate.type=='IfStatement')
        ifStatement(alternate,1);
    else {
        pushEntryProperties(line,'ElseStatement',null,null,null);
        line++;
        functionRunner(alternate);
    }
}

export {functionDeclaration,functionRunner, table, structures,  params, functionDeclarationHandler, variableDeclarationHandler,ifStatement, alternate,
    expressionStatementHandler, whileStatementHandler, forStatementHandler, ifStatementHandler, returnStatementHandler,blockStatementHandler, reset,
    singleCharExpression};