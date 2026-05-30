import { useState } from 'react';
import './App.css';
import logo from './assets/images/logo.png';
import minepic from './assets/images/minepic.png';

const menuItems = [
  'WORKS',
  'TECH STACKS',
  'EDUCATION',
  'RESUME',
  'CONTACT',
  'ABOUT'
];

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  return (
    <div className="home">
      <div className="name-block">
        <span>OJAS</span>
        <span className="name-block2">DHAR</span>
        <span className="name-block2" style={{fontSize: '25px'}}>GAVE</span>
      </div>

      <img className="brand-logo" src={logo} alt="OD logo" />

      <nav 
        className="menu" 
        aria-label="Primary"
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => {
          setIsMenuHovered(false);
          setHoveredIndex(null);
        }}
      >
        <div className="menu-inner">
          <ul>
            {menuItems.map((item, index) => (
              <li 
                key={item}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <span className={hoveredIndex === index ? 'active' : ''}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          
          <div className={`slider-track ${isMenuHovered ? 'visible' : ''}`}>
            <div 
              className={`slider-thumb ${hoveredIndex !== null ? 'visible' : ''}`}
              style={{
                top: hoveredIndex !== null
                  ? `calc(${hoveredIndex} * 20%)`
                  : '0%'
              }}
            />
          </div>
        </div>
      </nav>

      <div className="portrait-wrap">
        <img
          className="portrait"
          src={minepic}
          alt="Ojas Dhar Gave portrait"
        />
      </div>

      <div className="left-block">
        <div className="title" style={{marginBottom:'30px'}}>FULL STACK DEVOPS <br/>ENGINEER </div>
        <div className="title">CREATIVE DESIGNER <br/>& DEVELOPER</div>
        <div className="year">©2026</div>
      </div>

      <div className="right-block">
        <div className="location-label">CURRENTLY BASED IN <br/>NGP | AMD</div>
      </div>
    </div>
  );
}
