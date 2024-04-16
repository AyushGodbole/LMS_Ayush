function CarousalSlides({name,image,quote,slideNumber,totalNumberOfSlides}){
    console.log('num',slideNumber)
    return(
        <div id={`slide${slideNumber}`} className="carousel-item relative w-full">
                    <div className='flex flex-col items-center m-auto gap-4'>
                            <img src={image} className="w-[40%] rounded-full border border-gray-200" />
                            <h2 className='text-2xl font-semibold'>{name}</h2>
                            <p>{quote}</p>
                            <div className="absolute flex justify-between transform -translate-y-1/2 left-[7.25rem] right-[7.25rem] top-[45%]">
                            <a href={`#slide${slideNumber==1?totalNumberOfSlides:(totalNumberOfSlides-1)}`} className="btn btn-circle">❮</a> 
                            <a href={`#slide${((slideNumber)%(totalNumberOfSlides))+1}`} className="btn btn-circle">❯</a>
                            </div>
                    </div>
        </div> 
    );
}

export default CarousalSlides