pragma solidity ^0.5.0;
contract TodoList{
    uint public taskCount=0;
    struct Task {
    uint id;
    string content;
    bool completed;
  }
  event TaskCreated(
    uint id,
    string content,
    bool completed
  );
  event TaskCompleted(
    uint id,
    bool completed
  );
  mapping(uint=>Task) public tasks;
  constructor() public {
        createTask("Check out dappuniversity.com");
      }
  function createTask(string memory _content) public{
      taskCount++;
      tasks[taskCount] = Task(taskCount,_content,false);
      emit TaskCreated(taskCount,_content,false);
  }
  function toggleCompleted(uint _id) public {
    Task memory task = tasks[_id];
    task.completed = !task.completed;
    tasks[_id] = task;
    emit TaskCompleted(_id,task.completed);
  }
}