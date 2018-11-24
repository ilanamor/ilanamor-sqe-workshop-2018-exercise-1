import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
    it('is parsing Sequence Expression declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('low = 0, high = n - 1;')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"SequenceExpression","expressions":[{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low"},"right":{"type":"Literal","value":0,"raw":"0"}},{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"high"},"right":{"type":"BinaryExpression","operator":"-","left":{"type":"Identifier","name":"n"},"right":{"type":"Literal","value":1,"raw":"1"}}}]}}],"sourceType":"script"}'
        );
    });

    it('is parsing a while statement declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while(true){i++;}')),
            '{"type":"Program","body":[{"type":"WhileStatement","test":{"type":"Literal","value":true,"raw":"true"},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":false}}]}}],"sourceType":"script"}'
        );
    });

    it('is parsing a for statement declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for(i=0;i<5;i++){x[i]=i;}')),
            '{"type":"Program","body":[{"type":"ForStatement","init":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"i"},"right":{"type":"Literal","value":0,"raw":"0"}},"test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"i"},"right":{"type":"Literal","value":5,"raw":"5"}},"update":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":false},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"x"},"property":{"type":"Identifier","name":"i"}},"right":{"type":"Identifier","name":"i"}}}]}}],"sourceType":"script"}'
        );
    });

    it('is parsing an if statement declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if(X<=V[mid])high=mid-1;else if(X>V[mid])low=mid+1;')),
            '{"type":"Program","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<=","left":{"type":"Identifier","name":"X"},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"V"},"property":{"type":"Identifier","name":"mid"}}},"consequent":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"high"},"right":{"type":"BinaryExpression","operator":"-","left":{"type":"Identifier","name":"mid"},"right":{"type":"Literal","value":1,"raw":"1"}}}},"alternate":{"type":"IfStatement","test":{"type":"BinaryExpression","operator":">","left":{"type":"Identifier","name":"X"},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"V"},"property":{"type":"Identifier","name":"mid"}}},"consequent":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"mid"},"right":{"type":"Literal","value":1,"raw":"1"}}}},"alternate":null}}],"sourceType":"script"}'
        );
    });

    it('is parsing a function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){}')),
            '{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"binarySearch"},"params":[{"type":"Identifier","name":"X"},{"type":"Identifier","name":"V"},{"type":"Identifier","name":"n"}],"body":{"type":"BlockStatement","body":[]},"generator":false,"expression":false,"async":false}],"sourceType":"script"}'
        );
    });

    it('is parsing a full function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){ let low, high, mid; low = 0; high = n - 1; while (low <= high) { mid = (low + high)/2; if (X < V[mid]) high = mid - 1; else if (X > V[mid]) low = mid + 1; else return mid; } return -1; }')),
            '{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"binarySearch"},"params":[{"type":"Identifier","name":"X"},{"type":"Identifier","name":"V"},{"type":"Identifier","name":"n"}],"body":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low"},"init":null},{"type":"VariableDeclarator","id":{"type":"Identifier","name":"high"},"init":null},{"type":"VariableDeclarator","id":{"type":"Identifier","name":"mid"},"init":null}],"kind":"let"},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low"},"right":{"type":"Literal","value":0,"raw":"0"}}},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"high"},"right":{"type":"BinaryExpression","operator":"-","left":{"type":"Identifier","name":"n"},"right":{"type":"Literal","value":1,"raw":"1"}}}},{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<=","left":{"type":"Identifier","name":"low"},"right":{"type":"Identifier","name":"high"}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"mid"},"right":{"type":"BinaryExpression","operator":"/","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"low"},"right":{"type":"Identifier","name":"high"}},"right":{"type":"Literal","value":2,"raw":"2"}}}},{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"X"},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"V"},"property":{"type":"Identifier","name":"mid"}}},"consequent":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"high"},"right":{"type":"BinaryExpression","operator":"-","left":{"type":"Identifier","name":"mid"},"right":{"type":"Literal","value":1,"raw":"1"}}}},"alternate":{"type":"IfStatement","test":{"type":"BinaryExpression","operator":">","left":{"type":"Identifier","name":"X"},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"V"},"property":{"type":"Identifier","name":"mid"}}},"consequent":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"mid"},"right":{"type":"Literal","value":1,"raw":"1"}}}},"alternate":{"type":"ReturnStatement","argument":{"type":"Identifier","name":"mid"}}}}]}},{"type":"ReturnStatement","argument":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1"},"prefix":true}}]},"generator":false,"expression":false,"async":false}],"sourceType":"script"}'
        );
    });

});
