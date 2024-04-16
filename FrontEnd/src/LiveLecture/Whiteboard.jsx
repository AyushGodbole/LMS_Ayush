import { useState } from "react";

function Whiteboard(){

    const [tool,setTool] = useState('pencil')
    const [color,setColor] = useState('black')

    function handleToolChange(e){
        const {name,value} = e.target;

        // console.log('value',value)
        setTool(value);
        // console.log('tool',tool);
    }

    function handleColorChange(e){
        const {name,value} = e.target;

        setColor(value);
    }
    return(
        <div>
            <div className=" w-full">
                <h1 className="text-3xl flex justify-center py-6 text-white relative left-9">Live Session <span className=" text-sm absolute right-0 text-blue-500">[online users : 0 ]</span></h1>

                <div className=" relative right-16">
                <div className=" flex items-center w-[80vw] justify-around gap-5 pb-5 relative left-[133px]">
                    <div className=" flex gap-2 border border-white w-fit px-4 py-2">
                    <div className="flex items-center gap-1">
                        <input type="radio" name="tool" id="pencil" value='pencil' checked={tool==='pencil'} onChange={handleToolChange}/>
                        <label htmlFor="pencil">Pencil</label>
                    </div>

                    <div className="flex items-center  gap-1">
                        <input type="radio" name="tool" id="line" value='line' checked={tool==='line'} onChange={handleToolChange}/>
                        <label htmlFor="line">Line</label>
                    </div>

                    <div className="flex items-center  gap-1">
                        <input type="radio" name="tool" id="rectangle" value='rectangle' checked={tool==='rectangle'} onChange={handleToolChange}/>
                        <label htmlFor="rectangle">Rectangle</label>
                    </div>
                    </div>

                    <div>
                        <h1>Select color</h1>
                        <input type="color" name="color" id="color" value={color} onChange={handleColorChange} />
                    </div>

                    <div className="flex gap-2 justify-center items-center">
                        <button className="btn-primary px-4 py-2 rounded-md">undo</button>
                        <button className="btn-secondary px-4 py-2 rounded-md">redo</button>
                    </div>

                    <div>
                        <button className=" px-5 py-3 rounded-md bg-red-500 text-white font-semibold">Clear</button>
                    </div>
                </div>

                <div className=" flex justify-end">
                    <canvas className="  bg-white w-[80vw] h-[70vh] border border-black"></canvas>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Whiteboard;