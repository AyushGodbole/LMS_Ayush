import HomeLayout from '../Layouts/HomeLayout'
import aboutMainImage from '../Assets/Images/aboutMainImage.png'
import { celebs } from '../Constants/CelebrityData'
import CarousalSlides from '../Components/CarousalSlides'

function AboutUs(){
    return(
        <HomeLayout>
            <div className='flex flex-col text-black pl-20 pt-20'>
                <div className='flex items-center gap-5 mx-10'>
                    {/* left section */}
                    <section className='w-1/2 space-y-2'>
                        <h1 className='text-5xl text-green-500 font-semibold'>
                            Affordable and Quality Education.
                        </h1>
                        <p className='text-xl text-gray-600'>
                            Our aim is to provide the affordable and quality education in the world.
                            we are providing the platform for the aspiring teacher and students to 
                            share their skill,creativity and knowledge to each other to empower and 
                            contribute in the growth and wellness of mankind.
                        </p>
                    </section>

                    {/* right section */}
                    <section className='w-1/2 '>
                        <img src={aboutMainImage} alt="aboutImage" className='drop-shadow-2xl' style={
                            {
                                filter:'drop-shadow(0 10px 10px rgb(0,0,0.7))'
                            }
                        }/>
                    </section>
                </div>

                {/* carouse part */}

                <div className="carousel w-1/2 m-auto my-14">
                    {/* loop on array of carousal */}
                    {celebs && celebs.map((celebrity)=><CarousalSlides {...celebrity} totalNumberOfSlides={celebs.length} key={celebrity.slideNumber}/>)}
                </div>
                </div>
        </HomeLayout>
    )
}

export default AboutUs;