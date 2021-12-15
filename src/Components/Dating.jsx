import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { v4 as uuid } from 'uuid';

export const Dating = () => {

    const [edit, setedit] = useState(true);
    const [ides,setides]=useState(0);

    const [todate, setTodate] = useState(0);

    const [overlay, setO] = useState(false);
    const [meet, setMeet] = useState({});

    const [todaymeetings, settodaymeetings] = useState([]);

    const [condtn, setcondtn] = useState(true);

    let arr = [];
    for (let i = 0; i < 30; i++)
    { 
        arr[i] = i + 1;
    }

    const handleMeeting = (id) =>
    { 
        setTodate(id);
        setO(!overlay);
        axios.get(`http://localhost:3004/meetings?date=${id}`)
            .then((data) => { 
                settodaymeetings(data.data)
            })
    }

    const handleChange = (e) => { 
        const { name, value } = e.target;
        setMeet({ ...meet,[name]: value,date:todate,id:uuid()})
    }

    const handleShedule = () => { 

        if (edit) {
            axios.post("http://localhost:3004/meetings", meet);
        }
        else
        { 
            axios.patch(`http://localhost:3004/meetings/${ides}`,meet)
        }

        setO(!overlay);
        
    }


    const handleEventDelete = (id) => { 
        axios.delete(`http://localhost:3004/meetings/${id}`)
            .then((data) => { 
                console.log(data);
            })
        axios.get(`http://localhost:3004/meetings?date=${todate}`)
            .then((data) => { 
                settodaymeetings(data.data)
            })
    }

    const handleEventUpdate = (id) => { 
        setides(id);
        setedit(false);
        setcondtn(false);
    }



    return (
        <>
            <div style={{margin:"auto",width: '60vw', height: '400px', display: 'grid',gridTemplateColumns:"repeat(5,20%)",border: '1px solid black'}}>
            {
                arr.map((el) => { 
                    return <div key={el} onClick={()=>handleMeeting(el)} style={{textAlign: 'center',fontSize:"25px"}}>{ el }</div>
                })
            }
            </div>
            

            {overlay ? <div style={{position: 'absolute',top:"0",width: '100vw',height: '100vh',backgroundColor: 'rgb(0,0,0,0.6)'}}>
                <button onClick={() => { setO(!overlay)}}>close</button>
                
                <button onClick={()=>setcondtn(!condtn)}>Switch</button>

                {
                    condtn ?
                        <div style={{ width: '60%', height: '60%', backgroundColor: 'white', margin: "auto", marginTop: '10vh' }}>
                            {
                                todaymeetings !== null ? todaymeetings.map((el) => { 
                                    return <div key={el.id} style={{width:"100%",height:"30px",border: "1px solid black",padding:"10px"}}>
                                        {el.title}
                                        <button onClick={()=>handleEventUpdate(el.id)}>Edit</button>
                                        <button onClick={()=>handleEventDelete(el.id)}>Delete</button>
                                    </div>
                                }) : <div> <p>No meetings added</p></div>
                            }
                        </div> : 
                    
                        
                     <div style={{width: '60%', height: '60%',backgroundColor: 'white',margin:"auto",marginTop: '10vh'}}>

                    <input type="text" name="time" placeholder="add time"  onChange={(e)=>handleChange(e)} style={{width:"60%",height:"60px",paddingLeft:"4px",marginTop:"10px",marginLeft:"20%"}} /> <br />
                    <input type="text" name="venue" placeholder="add venue" onChange={(e)=>handleChange(e)}  style={{width:"60%",height:"60px",paddingLeft:"4px",marginTop:"10px",marginLeft:"20%"}} /> <br />
                    <input type="text" name="title" placeholder="add title" onChange={(e)=>handleChange(e)}  style={{width:"60%",height:"60px",paddingLeft:"4px",marginTop:"10px",marginLeft:"20%"}} />  <br />

                    <button onClick={handleShedule}>Shedule</button>
                    
                    </div>   
                }


            </div> : <div style={{position: 'absolute',display: 'none',top:"0",width: '100vw',height: '100vh',backgroundColor: 'rgb(0,0,0,0.6)'}}>

            </div>}
            

        </>
    )
}
