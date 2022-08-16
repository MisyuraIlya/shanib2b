// Global
import { createContext, useState, useContext, useEffect } from 'react';
import React from 'react';
import { ajax } from './ajaxFunction';
import axios from 'axios';
// Defines
const MachinesContex = createContext();

// React hook
const useMachines = () => {
  const context = useContext(MachinesContex);
  if (!context) {
    throw new Error('Can not run without "MachinesProvider"');
  }
  return context;
}

const MachinesProvider = (props) => {
  // State
  const [area, setArea] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [machinePerOneArea, setMachinePerOneArea] = useState([]);

  // Helpers

  const getMachinePeOneArea = async () => {
    setLoading(true);
    let code = 200
    const valAjax = {
      funcName: 'getMachines',
      point: 'machines',
      exId:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
      val:JSON.stringify(code)
    };

    try {
      const data = await ajax(valAjax);
      setMachinePerOneArea(data.SerNumbers)
    } catch (error) {
      console.error('[state/Machines/loadMachines] Failed to load Machiness', { error });
      setError({ isError: true, message: error.message });
    } finally {
      setLoading(false);
    }
  }

  
  const createMachines = async (title, description) => {
    try {
      
    } catch (error) {
      console.error('[state/Machines/createPost] Failed to load Machiness', { error });
      setError({ isError: true, message: error.message });
    }
  }

  const getAtarim = async () => {
    setLoading(true);
    const valAjax = {
      funcName: 'getAtarim',
      point: 'machines',
      exId:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
    };
    try{
      const data = await ajax(valAjax);
      setArea(data.DestCodes)
    } catch(e) {
      console.error('[state/MachineProvder/getAtarim] Failed to load Machiness', { error });
    } finally {
      setLoading(false)
    }
  }
  
  const getMachinePerArea = async (machine) => {
    setLoading(true);
    const valAjax = {
      funcName: 'getMachines',
      point: 'machines',
      exId:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
      val:machine
    };
    try{
      const data = await ajax(valAjax);
      console.log(data)
      setMachines(data.SerNumbers);

    }catch(e){
      console.error('[state/Machines/getMachinePerArea] Failed to load machines per category', { error });
    } finally{
      setLoading(false);
    }
  }

  const choosedMachineFault = async (machine) => {
    localStorage.setItem('machineFault', JSON.stringify(machine))
  }

  const uploadImage = async () => {
    setLoading(true);
    let base64Data = [] 
    JSON.parse(localStorage.uploadImage).map((item) => {
      let dataObj = item.base64.split(',')
      console.log(item)
      let obj = {
        type: dataObj[0],
        base64:dataObj[1],
        typeFile:item.type,
        fileName:item.fileName
      }
      base64Data.push(obj)
    })
    console.log(base64Data)
    const valAjax = {
      funcName: 'UploadImage',
      point: 'machines',
      // fileName:JSON.parse(localStorage.user).ExId,
      img:JSON.stringify(base64Data)
    }
    try{
      const data = await ajax(valAjax);
      // setArea(data.DestCodes)
      console.log('data',data)
    } catch(e) {
      console.error('[state/MachineProvder/getAtarim] Failed to load Machiness', { error });
    } finally {
      setLoading(false)
    }
  }

  const uploadVideo = async (videos) => {
    setLoading(true);
    // let base64Data = [] 
    // if(videos.length > 0){
    //   videos.map((item) => {
    //     let dataObj = item.base64.split(',')
    //     let obj = {
    //       type: dataObj[0],
    //       base64:dataObj[1],
    //       typeFile:item.type,
    //       fileName:item.fileName
    //     }
    //     base64Data.push(obj)
    //   })
    // } else {
    //   JSON.parse(localStorage.uploadVideo).map((item) => {
    //     let dataObj = item.base64.split(',')
    //     let obj = {
    //       type: dataObj[0],
    //       base64:dataObj[1],
    //       typeFile:item.type,
    //     }
    //     base64Data.push(obj)
    //   })
    // }

    console.log('send',base64Data)
    const valAjax = {
      funcName: 'UploadVideo',
      point: 'machines',
      // fileName:JSON.parse(localStorage.user).ExId,
      img:JSON.stringify(base64Data)
    }
    try{
      console.log('try')
      const data = await ajax(valAjax);
      console.log('try2')
      // setArea(data.DestCodes)
      console.log('data',data)
    } catch(e) {
      console.error('[state/MachineProvder/getAtarim] Failed to upload video', { error });
    } finally {
      setLoading(false)
    }
  }

  const sendFaultReport= async (machine, faultDesc, criticalError) => {

    let critical;
    if(criticalError){
      critical='כן'
    } else {
      critical='לא'
    }

    
    setLoading(true);
    let params;
    params = {
      Phone: JSON.parse(localStorage.user).Tel,
      Mail: JSON.parse(localStorage.user).Mail,
      Name: JSON.parse(localStorage.user).Name,
      MachineSerNumber: machine,
      Comment: faultDesc,
      CriticalError: critical,
      Area:JSON.parse(localStorage.user).faultArea,
      imgUrl: JSON.parse(localStorage.uploadImage),
      videoUrl: JSON.parse(localStorage.uploadVideo),
      userExId: JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
    }

    params = JSON.stringify(params);

    const valAjax = {
      funcName: 'WriteReport',
      point: 'machines',
      params: params
    };
    try {
      const data = await ajax(valAjax);
      console.log(data)
    } catch(err) {
      console.log('connection error order',err);
    } finally {
      setLoading(false);
    }
    console.log(params)
    
  }

  const formDataVideo = async (machine, faultDesc, criticalError, files) => {

    let critical;
    if(criticalError){
      critical='כן'
    } else {
      critical='לא'
    }

    // console.log('data', video)
    // setLoading(true);
    console.log(files)
    let formData = new FormData()

    for(let i = 0, len  =files.length; i<len; i++){
      formData.append(`files-${i}`,files[i], files[i].name)
    }
    formData.append('order',getRandomInt(10000))
    formData.append('name', 'test')
    formData.append('funcName','FormDataVideo')
    formData.append('point','machines')
    formData.append('server','1')

    formData.append('Phone',  JSON.parse(localStorage.user).Tel);
    formData.append('Mail', JSON.parse(localStorage.user).Mail);
    formData.append('Name', JSON.parse(localStorage.user).Name);
    formData.append('MachineSerNumber', machine);
    formData.append('Comment', faultDesc);
    formData.append('CriticalError', critical);
    formData.append('Area', JSON.parse(localStorage.user).faultArea);
    formData.append('userExId',JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId)




    // const valAjax = {
    //   funcName: 'FormDataVideo',
    //   point: 'machines',
    //   formData: formData
    // };
    try {
      // const data = await ajax(formData);
      const data2 = await axios({
        url:entry + '/app/app_data.php',
        method: 'POST',
        headers: {
          'Content-Length': files.length,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      }). then((res) => {

      }, (err) => {

      })
      // console.log(data)
    } catch(err) {
      console.log('connection error order',err);
    } finally {
      setLoading(false);
    }


  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  
  // Logic
  
  useEffect(() => getMachinePeOneArea(), []);

  // Export
  const methods = {
    createMachines,
    getMachinePeOneArea,
    getAtarim,
    getMachinePerArea,
    choosedMachineFault,
    uploadImage,
    uploadVideo,
    sendFaultReport,
    getMachinePeOneArea,
    formDataVideo
    
  };
  return <MachinesContex.Provider value={{
    machines,
    area,
    loading,
    methods,
    machinePerOneArea,
  }} {...props} />
}

export { useMachines, MachinesProvider };