import HomeSvg from '../assets/rocket-solid-full.svg'
import MorningRoutineSvg from '../assets/sun-solid-full.svg'
import ToDoListSvg from '../assets/list-check-solid-full.svg'
import NightTimeRoutineSvg from '../assets/moon-solid-full.svg'
import SettingsSvg from '../assets/gear-solid-full.svg' 
import WhySvg from '../assets/brain-solid-full.svg'

const ICON_REGISTRY = {
  homeImage: HomeSvg,
  morningImage: MorningRoutineSvg,
  todoImage: ToDoListSvg,
  nightImage: NightTimeRoutineSvg, 
  settingsImage: SettingsSvg,
  whyImage: WhySvg
};

export function Icon({name, className='', ...props}) {
  const iconSrc = ICON_REGISTRY[name]; 

  if (!iconSrc) {
    console.warn(`Icon "${name}" does not exist in your assets registry.`);
    return null;
  }

  return (
    <img 
      src={iconSrc}                      
      alt={`${name} icon`}               
      className={`nav-icon ${className}`} 
      {...props} 
    />
  );
}
