// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TaskContract {

  event AddTask(address recepient, uint taskId);
  event DeleteTask(uint taskId, bool isDeleted);

  struct Task{
    uint id;
    string taskText;
    bool isDeleted;
  }

  Task[] private tasks;
  mapping(uint256 => address) taskToOwner;

  // TaskContract.addText('Go to Gym', true);
  function addTask(string memory taskText, bool isDeleted) external {
    uint taskId = tasks.length;
    tasks.push(Task(taskId, taskText, isDeleted));

    taskToOwner[taskId] = msg.sender;
    emit AddTask(msg.sender, taskId);
  }


  // task that are mine and not yet deleted
  function getMyTasks() external view returns (Task[] memory){

    Task[] memory temporary = new Task[](tasks.length);

    uint counter = 0;

    for(uint i = 0; i < tasks.length; i++)
    {
      // temporary[empty, empty];
      if(taskToOwner[i] == msg.sender && tasks[i].isDeleted == false){
        temporary[counter] = tasks[i];
        counter++;
      }
    }
    Task[] memory result = new Task[](counter);
    for(uint i = 0; i < counter; i++)
    {
      result[i] = temporary[i];
    }
    return result;
  }

  function deleteTask(uint taskId, bool isDeleted) external {

    if(taskToOwner[taskId] == msg.sender){
      tasks[taskId].isDeleted = true;
      emit DeleteTask(taskId, isDeleted);
    }
    
  }
  
 
}

/*task = [
  {id:0, taskText:'Go to Gym', true},
  {id:0, taskText:'Go to Gym', true},
  {id:0, taskText:'Go to Gym', true},
]
*/

