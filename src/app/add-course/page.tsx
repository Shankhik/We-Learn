'use client';

import moduleStyle from "./page.module.css"
//import { useAuthContext } from "@/context/authContext";
import { useColorContext } from "@/context/colorScheme";
import ModuleClassname from "@/lib/cssUtil";
import { marked } from "marked";
import parse from "html-react-parser";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Button from "@/components/buttons/NewButton";
import { Course } from "@/types/databaseTypes";
import { useAuthContext } from "@/context/authContext";
import { ReqDataType } from "@/lib/apiReqDataType";

type Module= Course['modules'][number]

export default function Page (){
    const css = new ModuleClassname(moduleStyle);
    /* |||||||||||||||||||||||| User Contexts |||||||||||||||||||||||| */
    const {username} = useAuthContext();
    const {effectiveTheme} = useColorContext();

    /* ||||||||||||||||||||||||| Form States ||||||||||||||||||||||||| */
    const [mode, setMode] = useState<'update'|'add'>('add');
    const [courseName, setCourseName] = useState<string>('');
    const [courseId, setCourseId] = useState<string>('');
    const [courseSkills, setCourseSkills] = useState<string[]>([]);
    const [descriptionBlocks, setDescriptionBlocks] = useState<Course['description']>([]);
    const [modules, setModules] = useState<Partial<Module>[]>([]);
    const [author, setAuthor] = useState<string>(username||"");
    const [coursePrice, setCoursePrice] = useState<string>("0");
    const [courseImages, setCourseImages] = useState<{
        thumbnail: File|null;
        cover: File|null;
    }>({
        thumbnail: null,
        cover: null
    });

    const addModule = ()=>{
        setModules(prev=>{
            // Creates an Empty module
            return [...prev, {
                //moduleNumber: prev.length+1,
                title: '',
                blocks: []
            }]
        })
    }
    const addDescBlock = ()=>{
        setDescriptionBlocks(prev=>{
            const data = [...prev];
            data.push({
                type:"markdown",
                content:`new Block index: ${prev.length}`
            })
            return data;
        })
    }
    const deleteDescBlock = (index: number)=> ()=>{
        setDescriptionBlocks(prev=>{
            if(!prev[index]) return prev;
            return prev.filter((block, i)=> {
                return i!==index
            })
        }) 
    }
    const descBlockOnChange = (value: string, index: number) => {
        setDescriptionBlocks(prev=>{
            const newData = [...prev]
            newData[index].content = value
            return newData
        }) 
    }

    // On file change (input fields for images)
    const setFile = (type:'thumbnail'|'cover')=>{
        return (e:ChangeEvent<HTMLInputElement>)=>{
            const file = e.target.files?.item(0);
            if(!file) return;

            setCourseImages(prev=>{
                let newData = {...prev}
                if(type!=='cover' && type!=='thumbnail')
                    return prev;
                if(type==='cover')
                    newData.cover = file;
                else
                    newData.thumbnail = file;
                //console.log(newData);
                return newData;
            });

        }
    }
    
    // Course Upload
    const upload = async()=>{
        const data:ReqDataType['courses']['add-course']['boby'] = {
            courseId,
            courseName,
            description: descriptionBlocks,
            author:{name: author},
            skills: courseSkills,

            // Images File
            ...(courseImages.cover?{
                "image-cover": courseImages.cover
            }:undefined),
            ...(courseImages.thumbnail?{
                "image-thumbnail": courseImages.thumbnail
            }:undefined),

            price: {
                cost: parseInt(coursePrice),
                unit: 'rupee'
            },

            rating:{ rateCount: 0, userCount: 0 },
            modules: modules as Course['modules']
        }
        const formdata = new FormData();

        // Adds data to formdata
        Object.entries(data).forEach(([key,value])=>{
            // checks if the value is a file or not
            const isFile = value instanceof File
            const isArray = Array.isArray(value);
            // Adds [key,value] in formdata only if the values are valid
            if (
                value &&
                value!==""
                && value!==null
                // Avoids adding empty arrays
                && (isArray? value.length>0 :true)
            ){
                formdata.append(
                    key,
                    isFile? value: typeof value === 'object'?
                        JSON.stringify(value):value
                )
            }
            
        })
        
        let res:Response|Status = await fetch(`/api/courses2/add-course?mode=${mode}`,{
            method: 'POST',
            body: formdata,
            headers:{
                "Content-Type": "multipart/form-data",
            }
        });
        res = await res.json() as Status;
        console.log(res.error?res:res.course)
        alert(res.error||res.message);
    }

    return <>
    <div className={css.names(`section ${effectiveTheme}`)}
        style={{scrollbarWidth:'none'}}
    >
        <Button onClick={()=>setMode(prev=> prev==='add'?'update':'add')}>
            Current Mode: {mode.toUpperCase()}
        </Button>
        <p>Course Name: {courseName}</p>
        <p>Course Id: {courseId}</p>
        <p>Course Skills: {courseSkills.join(", ")}</p>
        
        {/* Course Name */}
        <div style={{display:'flex', marginTop:"14px"}}>
            <label>Course Name</label>
            <input type="text" style={{margin:'2px 0 2px auto'}}
                value={courseName}
                onChange={(e)=> {
                    setCourseName(e.target.value)
                }}
            />
        </div>

        {/* Couse ID */}
        <div style={{display:'flex'}}>
            <label>Course Id</label>
            <input type="text" style={{margin:'2px 0 2px auto'}}
                value={courseId}
                onChange={(e)=> {
                    setCourseId(e.target.value)
                }}
            />
        </div>

        {/* Course Price */}
        <div style={{display:'flex'}}>
            <label>Course Price [in Rupees]</label>
            <input type="text" style={{
                margin:'2px 0 2px auto'
            }} onChange={(e)=> setCoursePrice(e.target.value)}
            value={coursePrice}/>
        </div>

        {/* Thumbnail Image */}
        <div style={{display:'flex', margin:'2px 0'}}>
            <label>Thumbnail Image</label>
            <input type="file" style={{marginLeft:'auto'}}
            onChange={setFile('thumbnail')}/>
        </div>

        {/* Cover Image */}
        <div style={{display:'flex', margin:'2px 0'}}>
            <label>Cover Image</label>
            <input type="file" style={{marginLeft:'auto'}}
            onChange={setFile('cover')}/>
        </div>

        <div style={{display:'flex', marginTop:"14px"}}>
            <label>Author</label>
            <input type="text" style={{margin:'2px 0 2px auto'}}
                value={author}
                onChange={(e)=> {
                    setAuthor(e.target.value)
                }}
            />
        </div>
        <div style={{display:'flex'}}>
            <label>Course Skills</label>
            <input type="text" style={{margin:'2px 0 2px auto'}}
                // value={courseId}
                onChange={(e)=> {
                    const list = e.target.value.split(",")
                    .map(v=> v.trim())
                    .filter(v=> v!=='')

                    //console.log(list)
                    setCourseSkills(list)
                }}
            />
        </div>
        <label>Description</label>
        {descriptionBlocks.map((block,index)=>{
            return <div
                key={index}
                className={moduleStyle['module-section']}
            >
                <Button style={{margin:"0 0 5px auto"}}
                    onClick={deleteDescBlock(index)}
                >- Desc block
                </Button>
                {/* Block Type radio section */}
                <div style={{display:'flex', justifyContent:'space-around'}}>
                    <div className={moduleStyle['types']}
                        //onClick={(e)=> setBlockType(e,'video-iframe')}
                    >
                        <input type="radio"
                        checked={block?.type==='video-iframe'}
                        onChange={(e)=> {}}
                        /> <p>iFrame</p>
                    </div>
                    <div className={moduleStyle['types']}
                        //onClick={(e)=> setBlockType(e,'html')}
                    >
                        <input type="radio"
                        checked={block?.type==='html'}
                        onChange={(e)=> {}}
                        /> <p>Html</p>
                    </div>

                    <div className={moduleStyle['types']}
                        //onClick={(e)=> setBlockType(e,'markdown')}
                    >
                        <input type="radio"
                        checked={block?.type==='markdown'}
                        onChange={(e)=> {}}
                        /> <p>Markdown</p>
                    </div>
                </div>

                {/* Block Content Area */}
                <textarea style={{
                    margin:"10px 0", flexShrink:0,
                    resize:'none', border: 'none',
                    padding:'10px', outline: 'none',
                    borderRadius:'13px'
                }} onChange={(e) => {
                    const element = e.target;
                    element.style.height = "auto"
                    element.style.height = (element.scrollHeight-15)+"px"

                    descBlockOnChange(element.value,index)
                    //setDescription(element.value)
                }} value={block.content}/>
            </div>
        })}
        <Button onClick={addDescBlock} style={{marginBottom:"10px"}}>
            + Description block
        </Button>
        {modules.map((module, index)=>{
            return <ModuleSection
                moduleIndex={index}
                setModules={setModules}
                //setTitle={setModuleTitle}
                module={module} key={index}
            />
        })}
        
        <Button style={{margin:'auto 0 10px 0'}}
        onClick={addModule}
        >Add module</Button>
        <Button
            onClick={()=>console.log(getHtml(modules))}
        >Log Html</Button>
        <Button style={{margin:'10px 0 0 0'}}
            onClick={()=>{
                const d:Course = {
                    courseId: courseId,
                    courseName: courseName,
                    skills: courseSkills,
                    description: descriptionBlocks,
                    price:{
                        cost: parseInt(coursePrice),
                        unit: 'rupee'
                    },
                    rating: { rateCount: 0, userCount: 0 },
                    author: {
                        name: author,
                        website: undefined
                    },
                    modules: modules as Module[]
                }

                console.log(d)
            }}
        >Log Course</Button>
        <Button onClick={upload} style={{marginTop:'10px'}}
        >Upload Course</Button>
    </div>
    <div className={css.names(`section ${effectiveTheme}`)}>
        <div className={css.names(`output ${effectiveTheme}`)}>
            <Output modules={modules} description={descriptionBlocks}/>
        </div>
    </div>
    </>
}

type ModulesStateAction = SetStateAction<Partial<{
    title: string;
    moduleNumber: number;
    blocks: {
        type: "markdown" | "html" | "video-iframe";
        content: string;
    }[];
}>[]>

const ModuleSection = ({module, moduleIndex, setModules}:{
    module?: Partial<Module>,
    moduleIndex: number,
    setModules: Dispatch<ModulesStateAction>,
})=>{
    const removeModule = ()=>{
        setModules(prev=>{
            if(!prev[moduleIndex]) return prev
            return prev.filter((m,index)=> index!==moduleIndex)
        })
    }
    const setTitle = (title: string )=>{
        setModules( prev=>{
            const newModule = [...prev]
            newModule[moduleIndex].title = title
            return newModule
        })
    }
    const onAddBlock = ()=>{
        setModules(prev=>{
            const newModules = [...prev];
            
            newModules[moduleIndex].blocks?.push({
                type: 'markdown',
                content: ''
            })
            return newModules
        })
    }
    return <>
    <div className={moduleStyle['module-section']}>
        <h2>{moduleIndex+1}: {module?.title||"Unknown"}</h2>
        <label>Module Name</label>
        <input type="text" defaultValue={module?.title}
        style={{marginLeft:''}}
        onChange={(e)=> {
            setTitle &&
            setTitle(e.target.value)
        }}/>
        <Button style={{
            padding:'2px 8px',
            margin:'5px 0 5px auto'
        }} onClick={removeModule}>remove module</Button>

        {module?.blocks && module.blocks.map((block, index)=>{
            return <ModuleBlock
                key={index}
                blockNumber={index+1}
                block={block}
                moduleIndex={moduleIndex}
                setModules={setModules}
            />
        })}
        
        <Button style={{ margin:'20px auto'}}
            onClick={onAddBlock}
        >Module {moduleIndex+1}: Add Block</Button>
        <hr></hr>
    </div>
    </>
}
const ModuleBlock = ({setModules, block, blockNumber, moduleIndex}:{
    moduleIndex: number,
    blockNumber: number,
    block: Course['modules'][number]['blocks'][number]
    setModules: Dispatch<ModulesStateAction>
})=>{
    const removeBlock = ()=>{
        setModules(prev=>{
            const newModules = [...prev];
            const module = newModules[moduleIndex]

            if(!module || !module.blocks) return prev;

            module.blocks.splice(blockNumber-1,blockNumber-1)

            return newModules
        })
    }
    
    const onChange = ()=> (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        
        const element = e.target;
        element.style.height = "auto"
        element.style.height = (element.scrollHeight-15)+"px"
        
        setModules(prev=> {
            const newModules = [...prev];
            const module = newModules[moduleIndex]

            if(!module || !module.blocks) return prev

            module.blocks[blockNumber-1].content = e.target.value

            return newModules
        })
        //setOutput(parse(marked.use({}).parse(value,{async:false})))
    }

    const setBlockType = (e:any, value: typeof block.type)=>{
        setModules(prev=> {
            const newModules = [...prev];
            const md = newModules[moduleIndex]
            if(!md || !md.blocks) return prev;

            md.blocks[blockNumber-1].type=value
            return newModules;
        })
    }
    return<>
        <hr style={{margin:'14px 0 0 0' }}/>
        <h4 style={{margin:'14px 0 0 10px' }}>Block: {blockNumber}</h4>
        <div style={{display:'flex', justifyContent:'space-around'}}>
            
            <div className={moduleStyle['types']}
                onClick={(e)=> setBlockType(e,'video-iframe')}
            >
                <input type="radio"
                checked={block?.type==='video-iframe'}
                onChange={(e)=> {}}
                /> <p>iFrame</p>
            </div>
            <div className={moduleStyle['types']}
                onClick={(e)=> setBlockType(e,'html')}
            >
                <input type="radio"
                checked={block?.type==='html'}
                onChange={(e)=> {}}
                /> <p>Html</p>
            </div>

            <div className={moduleStyle['types']}
                onClick={(e)=> setBlockType(e,'markdown')}
            >
                <input type="radio"
                checked={block?.type==='markdown'}
                onChange={(e)=> {}}
                /> <p>Markdown</p>
            </div>
        </div>
        <Button style={{
            padding:'2px 8px',
            margin:'5px 0 5px auto'
        }} onClick={removeBlock}>remove block</Button>
        <textarea onChange={onChange()} defaultValue={block.content}/>
    </>
}

const Output = ({modules, description}:{
    modules:Partial<Module>[],
    description: Course['description']
})=>{
    const JSXElement = (props:{
        node: React.JSX.Element[] | React.JSX.Element | string
    })=>{
        return <>
            {props.node}
        </>
    }

    return <>

    {
        description.map((desc, index)=>{
            switch (desc.type){
                case "markdown":
                    return <JSXElement key={index}
                        node={parse(fromMarkdown(desc.content))}
                    />
                case "html":
                    return <JSXElement key={index}
                        node={parse(fromHTML(desc.content))}
                    />
                case "video-iframe":
                    return <JSXElement key={index}
                        node={parse(fromHTML(desc.content))}
                    />
            }
        })
    }
    <hr/>
    { // Modules Preview
        modules.map((module,index)=>{
            return module.blocks?.map((block,index)=>{
                switch(block.type){
                    case "markdown":
                        return <JSXElement key={index}
                            node={parse(fromMarkdown(block.content))}
                        />
                        
                    case "html":
                        return <JSXElement key={index}
                            node={parse(fromHTML(block.content))}
                        />
                        
                    case "video-iframe":
                        return <JSXElement key={index}
                            node={parse(fromHTML(block.content))}
                        />
                }
            })
        })
    }
    </>
}

const fromMarkdown = (markdown: string)=>{
    return marked.use({}).parse(markdown,{async:false})
}
const fromHTML = (html: string)=>{
    return html
}
const getHtml = (
    modules: Partial<Module>[]
)=>{
    // final Code
    let jsxCode ='';
    
    modules.forEach((module,index)=>{
        // All blocks codes of current module
        let blockCode = '';

        module.blocks?.forEach((block, index)=>{
            switch(block.type){
                case "markdown":
                    blockCode+= fromMarkdown(block.content);
                    break;
                case "html":
                    blockCode+= fromHTML(block.content);
                    break;
                case "video-iframe":
                    blockCode+= fromHTML(block.content);
                    break;
            }
        })
        // Add all the blocks code to the final code
        jsxCode+=blockCode
    })
    return jsxCode;
}