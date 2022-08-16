import React, { useEffect, useState } from 'react';
import {globalFileServer} from '../enums/global'
import { useMachines } from '../../state/MachineProvider';
import SweetAlert from 'sweetalert2';

const machine = [
    {id:1, title:'קרח', img:globalFileServer + '/shaniIcons/Asset 50.svg'},
    {id:2, title:'רוג', img:globalFileServer + '/shaniIcons/Asset 50.svg'},
    {id:3, title:'אספרסו', img:globalFileServer + '/shaniIcons/Asset 48.svg'},
    {id:4, title:'גלידה', img:globalFileServer + '/shaniIcons/Asset 51.svg'},
    {id:5, title:'גרטינה', img:globalFileServer + '/shaniIcons/Asset 52.svg'},
]

const FaultPage = () => {
    const [openSelect, setOpenSelect] = useState(false);
    const {machinePerOneArea, area, machines, loading, methods} = useMachines();
    const [optionsState, setOptionState] = useState()
    const [choosedMachine, setChoosedMachine] = useState();
    const [faultDesc, setFaultDesc] = useState();
    const [selectedImages, setSelectedImages] = useState([])
    const [selectedVideos, setSelectedVideos] = useState([])
    const [criticalError, setCriticalError] = useState(false)
    const [formDataVideo, setFormDataVideo] = useState([])
    const [formData, setFormData] = useState([])
    const getBase64 = (file) => {
        return new Promise((resolve,reject) => {
           const reader = new FileReader();
           reader.onload = () => resolve(reader.result);
           reader.onerror = error => reject(error);
           reader.readAsDataURL(file);
        });
    }

    const newOnCselectFile = async(event) => {
        const data = event.target.files
        setFormData(event.target.files)
    }
    const onSelectFile = async (event) => {
        const data = event.target.files
        if(data[0].type == 'image/png' || data[0].type == 'image/jpeg' || data[0].type == 'image/webp'){
            // setFormDataVideo(event.target.files[0])
            setFormData(event.target.files)
            const selectedFiles = event.target.files;
            const selectedFilesArray = Array.from(selectedFiles);
            const imagesArray = selectedFilesArray.map( async (file) => {
                const localData = getBase64(file).then(base64 => {
                return base64
                });
            let base64Data =  await localData
            let fileName =  JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId + '-' + Math.floor(Math.random() * 1000);
            return {url: URL.createObjectURL(file), base64:base64Data, type:data[0].type , fileName:fileName};
        })
        Promise.all(imagesArray).then((values) => {
            let filesImage = selectedImages 

            if(filesImage.length > 0) {
                console.log('1')
                const newarrImage = filesImage.concat(values)
                setSelectedImages(newarrImage);
                localStorage.setItem('uploadImage',JSON.stringify(newarrImage));
            } else {
                console.log('2')
                setSelectedImages(values);
                localStorage.setItem('uploadImage',JSON.stringify(values));
            }

          });
        }

        if(data[0].type ==  'video/mp4'){
            setFormData(event.target.files)
            const selectedFiles = event.target.files;
            const selectedFilesArray = Array.from(selectedFiles);
            const videoArray = selectedFilesArray.map( async (file) => {
                const localData = getBase64(file).then(base64 => {
                return base64
                });
            let base64Data =  await localData
            let fileName =  JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId + '-' + Math.floor(Math.random() * 1000);
            return {url: URL.createObjectURL(file), base64:base64Data, type:data[0].type,fileName:fileName };
        })
        Promise.all(videoArray).then((values) => {
            let filesVideo = selectedVideos 

            if(filesVideo.length > 0){
                const newarrVideo = filesVideo.concat(values)
                setSelectedVideos(newarrVideo);
                localStorage.setItem('uploadVideo',JSON.stringify(newarrVideo));
            } else {

            }
            setSelectedVideos(values);
            localStorage.setItem('uploadVideo',JSON.stringify(values));
          });
        }
    }

    const selectHandle = (e) => {
        setOptionState(e.ADDRESS)
        setOpenSelect(false);
        const areaChoosed = area.filter((item) => item.ADDRESS == e.ADDRESS);
        methods.getMachinePerArea(areaChoosed[0].Code);

    }
    const faultDescriptionHandler = (e) => {
        setFaultDesc(e.target.value)
        localStorage.setItem('faultMessage', e.target.value)
    }

    const choosedMachineFault = (item) => {
        setChoosedMachine(item.SERNUM)
        methods.choosedMachineFault(item)
    }

    const checkLocalStorageImage = () => {
        if(localStorage.uploadImage){
            setSelectedImages(JSON.parse(localStorage.uploadImage))
        }
    }

    const checkLocalStorageVideo = () => {
        if(localStorage.uploadVideo){
            setSelectedVideos(JSON.parse(localStorage.uploadVideo))
        }
    }

    const deleteImage = (image) => {
        setSelectedImages(selectedImages.filter((e) => e.url !== image))
        let localStorageData = JSON.parse(localStorage.uploadImage).filter((e) => e.url !== image)
        localStorage.setItem('uploadImage',JSON.stringify(localStorageData));
    }

    const deleteVideo= (video) => {
        setSelectedVideos(selectedVideos.filter((e) => e.url !== video))
        let localStorageData = JSON.parse(localStorage.uploadVideo).filter((e) => e.url !== video)
        localStorage.setItem('uploadVideo',JSON.stringify(localStorageData));
    }

    const sendMessage = () => {
        if(choosedMachine && faultDesc){
            SweetAlert({
            title: 'לשלוח דיוח?',
            type: 'info',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'אשר',
            cancelButtonText: 'בטל'
            }).then((check) => {
                if(check.value){
                    // methods.uploadImage()
                    // methods.uploadVideo(selectedVideos)
                    methods.formDataVideo(choosedMachine,faultDesc,criticalError,formData)

                    // methods.sendFaultReport(choosedMachine,faultDesc,criticalError)
                } 
            })
        } else {
            SweetAlert({
                title: 'לרשום תאור תקלה ולבחור מכונה!',
                type: 'info',
                showConfirmButton: false,
                timer: '4000'
            })
        }

    }

    const criticalErrorHandler = () => {
    SweetAlert({
        title: 'בטוח שזו תקלה משביתה?',
        type: 'info',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'אשר',
        cancelButtonText: 'בטל'
		}).then((check) => {
            if(check.value){
                setCriticalError(true);
            } 
        })
    }
     
    useEffect(() => {
        methods.getAtarim()
    },[])

    useEffect(() => {
        checkLocalStorageImage()
    },[])

    useEffect(() => {
        checkLocalStorageVideo()
    },[])


    return (
    <div className='fault_page_main'>
        <div className='fault_page_container'>
            <div className='fault_card_container'>
                <h2>בחר אתר</h2>
            
                {loading ?
                    <div className="spinner-wrapper">
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </div>
                :    
                <div>
                    {area.length > 1 ? 
                    <div className='selection_card'>
                        <div className={openSelect ? "select active padding" : "select padding"}>
                            <div onClick={() => setOpenSelect(!openSelect)}  className="headind">
                            <p>{optionsState ? optionsState : 'בחר אתר'}</p>
                            <div className="img">
                                <img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
                            </div>
                            </div>
                            <div className={openSelect ? "masc active" : "masc"}>
                            <ul>
                                {area.map((ele,ind) => {
                                return(
                                    <li key={ind}>
                                    <div className="mask-li-cls" onClick={() => selectHandle(ele)}>
                                        <span>{ele.Code + ' | ' +ele.ADDRESS}</span>
                                        <div className="img">
                                        <img src={globalFileServer + 'icons/back-select.svg'} alt=""/>
                                        </div>
                                    </div>
                                    </li>
                                )
                                })}
                            </ul>
                            </div>
                        </div>
                    </div>

                    : null
                }



                {/* <select value={optionsState} onChange={(e) => selectHandle(e) }>
                    {area.map((item) => 
                    <option value={item.ADDRESS} selected={optionsState == item.ADDRESS}>{item.ADDRESS}</option>
                    )}
                </select> */}
            
                {optionsState ? 
                <div>
                <h2>באיזו מכונה התקלה?</h2>
                <div className='fault_machine'> 
                    {machines ?
                        machines.map((item) => {
                            let img;
                            if(item.FAMILYNAME == 'GRAN-MAC'){
                                img = globalFileServer + '/shaniIcons/Asset 52.svg'
                            } else if(item.FAMILYNAME == 'COFF-MAC' || item.FAMILYNAME == 'COFF-PAR'){
                                img = globalFileServer + '/shaniIcons/Asset 48.svg'
                            } else if(item.FAMILYNAME == 'Ice-Frez' || item.FAMILYNAME == 'GLID-MAC'){
                                img = globalFileServer + '/shaniIcons/Asset 51.svg'
                            }
                            
                            return(
                            <div className='card_machine' onClick={() => choosedMachineFault(item)}>
                                <div className={choosedMachine == item.SERNUM ? 'circle_img_machine_active' : 'circle_img_machine'}>
                                    <img src={img}/>
                                </div>
                                <p>מספר סידורי: {item.SERNUM}</p>
                                <p>{item.PARTDES}</p>
                            </div>
                        )})
                    :   <div>אין מכונות באתר הזה</div>}
                </div>
                </div>
                : null}

                {area.length == 1 ? 
                <div>
                    <h2>באיזו מכונה התקלה?</h2>
                    <div className='fault_machine'> 
                        {machinePerOneArea ? 
                            machinePerOneArea.map((item) => {
                                let img;
                                if(item.FAMILYNAME == 'GRAN-MAC'){
                                    img = globalFileServer + '/shaniIcons/Asset 52.svg'
                                } else if(item.FAMILYNAME == 'COFF-MAC' || item.FAMILYNAME == 'COFF-PAR'){
                                    img = globalFileServer + '/shaniIcons/Asset 48.svg'
                                } else if(item.FAMILYNAME == 'Ice-Frez' || item.FAMILYNAME == 'GLID-MAC'){
                                    img = globalFileServer + '/shaniIcons/Asset 51.svg'
                                }
                                
                                return(
                                <div className='card_machine' onClick={() => choosedMachineFault(item)}>
                                    <div className={choosedMachine == item.SERNUM ? 'circle_img_machine_active' : 'circle_img_machine'}>
                                        <img src={img}/>
                                    </div>
                                    <p>מספר סידורי: {item.SERNUM}</p>
                                    <p>{item.PARTDES}</p>
                                </div>
                            )})
                        :   <div>אין מכונות באתר הזה</div>}
                    </div>
                </div>
                : null}

                
            </div> 
                
                }

                <div className='problem_form'>
                    <input type='text' value={faultDesc} placeholder='אנא כתוב כאן בקצרה מה התקלה' onChange={(e) => faultDescriptionHandler(e)}/>
                </div>

                <div className='flex-container send_buttons'>
                    <div className='col-lg-6 '>
                        <div className='circle_button'>
                            <img src={globalFileServer + '/shaniIcons/Asset 49.svg'}/>
                            <input type="file" name="images" onChange={onSelectFile} multiple accept='image/png, image/jpeg, image/webp .mov,.mp4'/>
                        </div>
                        <p>העלאת תמונה או וידאו</p>
                    </div>
                    <div className='col-lg-6 '>
                        <div className={criticalError ? ' circle_button_critical' : 'circle_button'} onClick={criticalErrorHandler}>
                            <img  type="file" src={globalFileServer + '/shaniIcons/Asset 47.svg'}/>
                        </div>
                        <p>לחץ אם זו תקלה משביתה</p>
                    </div>
                </div>



                <div className='uploaded'>
                    {selectedImages.length > 0|| selectedVideos.length > 0 ? 
                    <div>
                        <h2>רשימת הקצבים</h2>
                    </div>
                    
                    : null}
                    <div className='flex-container '>
                    {selectedImages &&
                    selectedImages.map((image,index) => {
                        return (
                            <div key={index} className="col-lg-3 upload_file_card">
                                <img src={image.base64} height="200" alt="upload"/>
                                <button onClick={() => deleteImage(image.url)}>X</button>
                            </div>
                        )
                    })}
                    {selectedVideos &&
                    selectedVideos.map((video,index) => {
                        return (
                            <div key={video} className="col-lg-3 upload_file_card">
                                <video src={video.base64} controls  height="200" alt="upload"/>
                                <button onClick={() => deleteVideo(video.url)}>X</button>
                            </div>
                        )
                    })}
                    </div>                   
                </div>
                <div className='send_form'>
                    <button onClick={sendMessage}>שלח דיווח</button>
                </div>
            </div>


        </div>
    </div>

    );
};

export default FaultPage;