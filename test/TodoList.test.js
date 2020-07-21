const { assert } = require("chai");

const TodoList = artifacts.require("./TodoList.sol");
contract("TodoList", (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed();
  });
  it("Deploys The Contract Successfully", async () => {
    const address = this.todoList.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
  it("Lists all the tasks", async () => {
    const taskCount = await this.todoList.taskCount();
    const task = await this.todoList.tasks(taskCount);
    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, "Check out dappuniversity.com");
    assert.equal(task.completed, false);
    assert.equal(taskCount.toNumber(), 1);
  });
  it("Creates Task", async () => {
    const result = await this.todoList.createTask("A new task");
    const taskCount = await this.todoList.taskCount();
    assert.equal(taskCount, 2);
    // console.log(result);
    //All the concerned output is there in result.logs[0].args
    const event = result.logs[0].args;
    console.log(event);
    assert.equal(event.id.toNumber(), 2);
    assert.equal(event.content, "A new task");
    assert.equal(event.completed, false);
  });
  it("Toggles Task Completion", async () => {
    const result = await this.todoList.toggleCompleted(1);
    const task = await this.todoList.tasks(1);
    assert.equal(task.completed, true);
  });
});
