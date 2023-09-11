import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import TaskAbi from '../../backend/build/contracts/TaskContract.json'
import { TaskContractAddress } from '../config.js'
import { ethers } from 'ethers'


// const ethers = require("ethers");
import { useState, useEffect } from 'react'

/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {

  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    connectWallet()
    getAllTasks()
  }, [])
// 
 

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {

    try{
      const  {ethereum} = window
      if(!ethereum){
        console.log('Metamask not detected');
        return
      }

      let chainId = await ethereum.request({method: 'eth_chainId'})
      console.log('Connected to chain: ', chainId );

      // TODO: Rinkeby is a test network
      const rinkebyChainId = '0x4' 
      // const Mumbai = '80001'

      if(chainId == rinkebyChainId){
        alert('You are not connected to the rinkeby chain network. ')
        setCorrectNetwork(false)
        return
      }
      else{
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'}) 

      console.log('Found accounts', accounts[0]);
      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);
    }
   
     catch(error){
      console.log(error);
    }


  }

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try{
      const {ethereum} = window

      if(ethereum){
        // const web3Provider = await getWeb3Provider()
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer =  provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        let allTasks = await TaskContract.getMyTasks()
        setTasks(allTasks)

      }
      else{
        console.log('ethereum object does not exist');
      }

    }

    catch (error){
      console.log(error);
    }

  }

  // Add tasks from front-end onto the blockchain
  const addTask = async e => {

    e.preventDefault()

    let task = {
      taskText: input,
      isDeleted: false
    }
    try{
      // const {ethereum} = window

      if (ethereum){
      
        // const provider =  new ethers.providers.Web3Provider(ethereum)
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer =  provider.getSigner()
        // console.log(provider);

        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        

        TaskContract.addTask(task.taskText, task.isDeleted)
        .then(() =>{
          setTasks([...tasks, task])
          console.log('task added successfully');
        })
        .catch(err =>{
          console.log(err);
        })
      }
      else{
        console.log('ethereum object not found');

      }
    }


    catch (err){
      console.log(err);
    }
    setInput('')




   

  }

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = key => async () => {

    try{
      const {ethereum} = window

      if(ethereum){
        // const web3Provider = await getWeb3Provider()
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer =  provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        const deleteTransaction = await TaskContract.deleteTask(key, true)
        let allTasks = await TaskContract.getMyTasks()
        setTasks(allTasks)
      }
      else{
        console.log('ethereum not found');
      }
    }
    catch (error){
      console.log(error);
    }

  }

  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton  connectWallet={connectWallet}/> :
        correctNetwork ? <TodoList tasks={tasks} input={input} setInput={setInput} addTask={addTask} deleteTask={deleteTask} /> : <WrongNetworkMessage />}
    </div>
  )
}

