import assert from 'assert';
import * as parser from '../src/js/parser';


describe('Check table-parser functions', () => {
    let testObject;
    let testTable=[];

    beforeEach(function() {
        // runs before each test in this block
        parser.reset();
        testTable=[];
    });

    function addEntry(line,type,name,condition,value){
        testTable.push({ line:line ,type : type ,name : name ,condition : condition ,value : value });
    }

    it('Function params declaration', () => {
        testObject = [{
            "type": "Identifier",
            "name": "X"
        }];
        parser.params(testObject);
        addEntry(1,'FunctionParameter','X',null,null);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function declaration handler', () => {
        testObject = {
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": "binarySearch"
            },
            "params": [],
            "body": {
                "type": "BlockStatement",
                "body": []
            },
            "generator": false,
            "expression": false,
            "async": false
        };
        parser.functionDeclarationHandler(testObject);
        addEntry(1,'FunctionDeclaration','binarySearch',null,null);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function variable declaration', () => {
        testObject = {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "low"
                    },
                    "init": null
                }
            ],
            "kind": "let"
        };
        parser.variableDeclarationHandler(testObject);
        addEntry(1,'VariableDeclarator','low',null,null);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function expression declaration- Assignment', () => {
        testObject = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "Identifier",
                    "name": "low"
                },
                "right": {
                    "type": "Literal",
                    "value": 0,
                    "raw": "0"
                }
            }
        };
        parser.expressionStatementHandler(testObject);
        addEntry(1,'AssignmentExpression','low',null,0);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function expression declaration- Member Expression', () => {
        testObject = {
            "type": "MemberExpression",
            "computed": true,
            "object": {
                "type": "Identifier",
                "name": "V"
            },
            "property": {
                "type": "Identifier",
                "name": "mid"
            }
        };
        parser.singleCharExpression(testObject);
        assert.deepEqual(parser.singleCharExpression(testObject),'V[mid]');
    });

    it('Function sequence expression declaration', () => {
        testObject = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "SequenceExpression",
                "expressions": [
                    {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "low"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    },
                    {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "high"
                        },
                        "right": {
                            "type": "BinaryExpression",
                            "operator": "-",
                            "left": {
                                "type": "Identifier",
                                "name": "n"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 1,
                                "raw": "1"
                            }
                        }
                    }
                ]
            }
        };
        parser.expressionStatementHandler(testObject);
        addEntry(1,'AssignmentExpression','low',null,0);
        addEntry(1,'AssignmentExpression','high',null,'n-1');
        assert.deepEqual(parser.table,testTable);

    });

    it('Function while statement declaration', () => {
        testObject = {
            "type": "WhileStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": "<=",
                "left": {
                    "type": "Identifier",
                    "name": "low"
                },
                "right": {
                    "type": "Identifier",
                    "name": "high"
                }
            },
            "body": {
                "type": "BlockStatement",
                "body": []
            }
        };
        parser.whileStatementHandler(testObject);
        addEntry(1,'WhileStatement',null,'low<=high',null);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function for statement declaration - no 1', () => {
        testObject = {
            "type": "ForStatement",
            "init": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "Identifier",
                    "name": "i"
                },
                "right": {
                    "type": "Literal",
                    "value": 0,
                    "raw": "0"
                }
            },
            "test": {
                "type": "BinaryExpression",
                "operator": "<",
                "left": {
                    "type": "Identifier",
                    "name": "i"
                },
                "right": {
                    "type": "Literal",
                    "value": 5,
                    "raw": "5"
                }
            },
            "update": {
                "type": "UpdateExpression",
                "operator": "++",
                "argument": {
                    "type": "Identifier",
                    "name": "i"
                },
                "prefix": false
            },
            "body": {
                "type": "BlockStatement",
                "body": []
            }
        };
        parser.forStatementHandler(testObject);
        addEntry(1,'ForStatement',null,'i=0;i<5;i++',null);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function for statement declaration - no 2', () => {
        testObject = {
            "type": "ForStatement",
            "init": {
                "type": "SequenceExpression",
                "expressions": [
                    {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    },
                    {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 5,
                            "raw": "5"
                        }
                    }
                ]
            },
            "test": {
                "type": "BinaryExpression",
                "operator": "<",
                "left": {
                    "type": "Identifier",
                    "name": "x"
                },
                "right": {
                    "type": "MemberExpression",
                    "computed": true,
                    "object": {
                        "type": "Identifier",
                        "name": "M"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "y"
                    }
                }
            },
            "update": {
                "type": "UpdateExpression",
                "operator": "++",
                "argument": {
                    "type": "Identifier",
                    "name": "x"
                },
                "prefix": true
            },
            "body": {
                "type": "BlockStatement",
                "body": []
            }
        };
        parser.forStatementHandler(testObject);
        addEntry(1,'ForStatement',null,'x=0,y=5;x<M[y];++x',null);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function if statement declaration', () => {
        testObject = {
            "type": "IfStatement",
            "test": {
                "type": "Literal",
                "value": true,
                "raw": "true"
            },
            "consequent": {
                "type": "BlockStatement",
                "body": []
            },
            "alternate": null
        };
        parser.ifStatementHandler(testObject);
        addEntry(1,'IfStatement',null,'true',null);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function else if statement declaration', () => {
        testObject = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": ">",
                "left": {
                    "type": "MemberExpression",
                    "computed": true,
                    "object": {
                        "type": "Identifier",
                        "name": "M"
                    },
                    "property": {
                        "type": "MemberExpression",
                        "computed": true,
                        "object": {
                            "type": "Identifier",
                            "name": "N"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "x"
                        }
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": 9,
                    "raw": "9"
                }
            },
            "consequent": {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "UpdateExpression",
                    "operator": "--",
                    "argument": {
                        "type": "Identifier",
                        "name": "x"
                    },
                    "prefix": false
                }
            },
            "alternate": null
        };
        parser.alternate(testObject);
        addEntry(1,'ElseIfStatement',null,'M[N[x]]>9',null);
        addEntry(2,'UpdateExpression','x',null,'x--');
        assert.deepEqual(parser.table,testTable);
    });

    it('Function else statement declaration', () => {
        testObject = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": "<",
                "left": {
                    "type": "Identifier",
                    "name": "x"
                },
                "right": {
                    "type": "Literal",
                    "value": 5,
                    "raw": "5"
                }
            },
            "consequent": {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "UpdateExpression",
                    "operator": "++",
                    "argument": {
                        "type": "Identifier",
                        "name": "x"
                    },
                    "prefix": false
                }
            },
            "alternate": {
                "type": "ReturnStatement",
                "argument": {
                    "type": "UnaryExpression",
                    "operator": "-",
                    "argument": {
                        "type": "Literal",
                        "value": 1,
                        "raw": "1"
                    },
                    "prefix": true
                }
            }
        };
        parser.ifStatement(testObject,0);
        addEntry(1,'IfStatement',null,'x<5',null);
        addEntry(2,'UpdateExpression','x',null,'x++');
        addEntry(3,'ElseStatement',null,null,null);
        addEntry(4,'ReturnStatement',null,null,-1);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function block statement declaration', () => {
        testObject = {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "UpdateExpression",
                        "operator": "++",
                        "argument": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "prefix": false
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "low"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "UpdateExpression",
                        "operator": "--",
                        "argument": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "prefix": true
                    }
                }
            ]
        };
        parser.blockStatementHandler(testObject);
        addEntry(1,'UpdateExpression','x',null,'x++');
        addEntry(2,'AssignmentExpression','low',null,0);
        addEntry(3,'UpdateExpression','y',null,'--y');
        assert.deepEqual(parser.table,testTable);
    });

    it('Function return statement declaration', () => {
        testObject = {
            "type": "ReturnStatement",
            "argument": {
                "type": "UnaryExpression",
                "operator": "-",
                "argument": {
                    "type": "Literal",
                    "value": 1,
                    "raw": "1"
                },
                "prefix": true
            }
        };
        parser.returnStatementHandler(testObject);
        addEntry(1,'ReturnStatement',null,null,-1);
        assert.deepEqual(parser.table,testTable);
    });

    it('Function Declaration', () => {
        testObject = {
            "type": "Program",
            "body": [
                {
                    "type": "FunctionDeclaration",
                    "id": {
                        "type": "Identifier",
                        "name": "binarySearch"
                    },
                    "params": [
                        {
                            "type": "Identifier",
                            "name": "X"
                        },
                        {
                            "type": "Identifier",
                            "name": "V"
                        },
                        {
                            "type": "Identifier",
                            "name": "n"
                        }
                    ],
                    "body": {
                        "type": "BlockStatement",
                        "body": [
                            {
                                "type": "VariableDeclaration",
                                "declarations": [
                                    {
                                        "type": "VariableDeclarator",
                                        "id": {
                                            "type": "Identifier",
                                            "name": "low"
                                        },
                                        "init": null
                                    },
                                    {
                                        "type": "VariableDeclarator",
                                        "id": {
                                            "type": "Identifier",
                                            "name": "high"
                                        },
                                        "init": null
                                    },
                                    {
                                        "type": "VariableDeclarator",
                                        "id": {
                                            "type": "Identifier",
                                            "name": "mid"
                                        },
                                        "init": null
                                    }
                                ],
                                "kind": "let"
                            },
                            {
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "AssignmentExpression",
                                    "operator": "=",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "low"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 0,
                                        "raw": "0"
                                    }
                                }
                            },
                            {
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "AssignmentExpression",
                                    "operator": "+=",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "high"
                                    },
                                    "right": {
                                        "type": "BinaryExpression",
                                        "operator": "-",
                                        "left": {
                                            "type": "Identifier",
                                            "name": "n"
                                        },
                                        "right": {
                                            "type": "Literal",
                                            "value": 1,
                                            "raw": "1"
                                        }
                                    }
                                }
                            },
                            {
                                "type": "WhileStatement",
                                "test": {
                                    "type": "BinaryExpression",
                                    "operator": "<=",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "low"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "high"
                                    }
                                },
                                "body": {
                                    "type": "BlockStatement",
                                    "body": [
                                        {
                                            "type": "ExpressionStatement",
                                            "expression": {
                                                "type": "AssignmentExpression",
                                                "operator": "=",
                                                "left": {
                                                    "type": "Identifier",
                                                    "name": "mid"
                                                },
                                                "right": {
                                                    "type": "BinaryExpression",
                                                    "operator": "/",
                                                    "left": {
                                                        "type": "BinaryExpression",
                                                        "operator": "+",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "low"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "high"
                                                        }
                                                    },
                                                    "right": {
                                                        "type": "Literal",
                                                        "value": 2,
                                                        "raw": "2"
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "type": "IfStatement",
                                            "test": {
                                                "type": "BinaryExpression",
                                                "operator": "<",
                                                "left": {
                                                    "type": "Identifier",
                                                    "name": "X"
                                                },
                                                "right": {
                                                    "type": "MemberExpression",
                                                    "computed": true,
                                                    "object": {
                                                        "type": "Identifier",
                                                        "name": "V"
                                                    },
                                                    "property": {
                                                        "type": "Identifier",
                                                        "name": "mid"
                                                    }
                                                }
                                            },
                                            "consequent": {
                                                "type": "ExpressionStatement",
                                                "expression": {
                                                    "type": "AssignmentExpression",
                                                    "operator": "=",
                                                    "left": {
                                                        "type": "Identifier",
                                                        "name": "high"
                                                    },
                                                    "right": {
                                                        "type": "BinaryExpression",
                                                        "operator": "-",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "mid"
                                                        },
                                                        "right": {
                                                            "type": "Literal",
                                                            "value": 1,
                                                            "raw": "1"
                                                        }
                                                    }
                                                }
                                            },
                                            "alternate": {
                                                "type": "IfStatement",
                                                "test": {
                                                    "type": "BinaryExpression",
                                                    "operator": ">",
                                                    "left": {
                                                        "type": "Identifier",
                                                        "name": "X"
                                                    },
                                                    "right": {
                                                        "type": "MemberExpression",
                                                        "computed": true,
                                                        "object": {
                                                            "type": "Identifier",
                                                            "name": "V"
                                                        },
                                                        "property": {
                                                            "type": "Identifier",
                                                            "name": "mid"
                                                        }
                                                    }
                                                },
                                                "consequent": {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "type": "AssignmentExpression",
                                                        "operator": "=",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "low"
                                                        },
                                                        "right": {
                                                            "type": "BinaryExpression",
                                                            "operator": "+",
                                                            "left": {
                                                                "type": "Identifier",
                                                                "name": "mid"
                                                            },
                                                            "right": {
                                                                "type": "Literal",
                                                                "value": 1,
                                                                "raw": "1"
                                                            }
                                                        }
                                                    }
                                                },
                                                "alternate": {
                                                    "type": "ReturnStatement",
                                                    "argument": {
                                                        "type": "Identifier",
                                                        "name": "mid"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "type": "ReturnStatement",
                                "argument": {
                                    "type": "UnaryExpression",
                                    "operator": "-",
                                    "argument": {
                                        "type": "Literal",
                                        "value": 1,
                                        "raw": "1"
                                    },
                                    "prefix": true
                                }
                            }
                        ]
                    },
                    "generator": false,
                    "expression": false,
                    "async": false
                }
            ],
            "sourceType": "script"
        };
        assert.equal(parser.functionDeclaration(testObject).length,18);
    });

    it('Not supported function', () => {
        testObject = {
            "type": "NotSupported",
            "id": {
                "type": "Identifier",
                "name": "sample"
            },
            "params": [],
            "body": {
                "type": "BlockStatement",
                "body": []
            }
        };
        assert.equal(parser.functionRunner(testObject),null);
    });

});