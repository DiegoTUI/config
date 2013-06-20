/**
 * TuiInnovation.
 * Fake unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

function testSomething (test){
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
}

function testSomethingElse(test){
    test.ok(false, "this assertion should fail");
    test.done();
}

exports.testSomething =  testSomething;
exports.testSomethingElse = testSomethingElse;