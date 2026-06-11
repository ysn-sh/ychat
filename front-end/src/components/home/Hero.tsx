import './Hero.css'

export default function Hero () {
    return( 
    <div className="hero-container">
        <div className='hero-text'>
            <h1>
                <h1 style={
                    {color:'var(--accent)',
                    fontSize: '150%'
                }}>YChat</h1> 
                smooth, secure, sexy.
            </h1>
        <div>
            <p>
            free messenger app designed and developed by a guy with too much free time.
        </p>
            <a className='hero-CTA' href='/register'>
            Create an account &#x2192;
        </a>
            </div>
        
        </div>
        <img src="/images/HomePage/placeholderShowcase.jpeg" alt="App Showcase image"></img>
    </div>
    )
}