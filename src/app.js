// var Web3 = require("web3");
// var web3 = new Web3(Web3.currentProvider);
// App = {
//   load: async () => {
//     await App.loadWeb3();
//     await App.loadAccount();
//   },
//   loadWeb3: async () => {
//     if (typeof web3 !== "undefined") {
//       App.web3Provider = web3.currentProvider;
//     } else {
//       window.alert("Please connect to Metamask.");
//     }
//     // Modern dapp browsers...
//     if (window.ethereum) {
//       window.web3 = new Web3(ethereum);
//       try {
//         // Request account access if needed
//         await window.ethereum.enable();
//         // Acccounts now exposed
//         web3.eth.sendTransaction({
//           /* ... */
//         });
//       } catch (error) {
//         // User denied account access...
//       }
//     }
//     // Legacy dapp browsers...
//     else if (window.web3) {
//       App.web3Provider = web3.currentProvider;
//       window.web3 = new Web3(web3.currentProvider);
//       // Acccounts always exposed
//       web3.eth.sendTransaction({
//         /* ... */
//       });
//     }
//     // Non-dapp browsers...
//     else {
//       console.log(
//         "Non-Ethereum browser detected. You should consider trying MetaMask!"
//       );
//     }
//   },
//   loadAccount: async () => {
//     web3 = new Web3(web3.currentProvider);
//     App.account = web3.eth.accounts[0];
//     console.log(App.account);
//   },
// };

// $(() => {
//   $(window).load(() => {
//     App.load();
//   });
// });

App = {
  contracts: {},
  loading: false,
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderTasks();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0];
  },

  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    //Basically the following 2 lines will give the Javascript copy of the smart contract
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);
    App.todoList = await App.contracts.TodoList.deployed();
    console.log(App.todoList);
  },
  render: async () => {
    if (App.loading) {
      return;
    }
    App.setLoading(true);

    $("#account").html(App.account);
    App.setLoading(false);
  },
  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount();
    console.log(taskCount);
    const $taskTemplate = $(".taskTemplate");
    for (var i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);

      // Put the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // Show the task
      $newTaskTemplate.show();
    }
  },
  createTask: async () => {
    App.setLoading(true);
    const content = $("#newTask").val();
    await App.todoList.createTask(content);
    App.setLoading(false);
    window.location.reload();
  },
  toggleCompleted: async (e) => {
    App.setLoading(true);
    const value = e.target.name;
    await App.todoList.toggleCompleted(value);
    window.location.reload();
  },
  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
