import HomeSvg from '../assets/rocket-solid-full.svg'
import MorningRoutineSvg from '../assets/sun-solid-full.svg'
import ToDoListSvg from '../assets/list-check-solid-full.svg'
import NightTimeRoutineSvg from '../assets/moon-solid-full.svg'
import SettingsSvg from '../assets/gear-solid-full.svg' 

const ICON_REGISTRY = {
  homeImage: HomeSvg,
  morningImage: MorningRoutineSvg,
  todoImage: ToDoListSvg,
  nightImage: NightTimeRoutineSvg, 
  settingsImage: SettingsSvg 
};

export function Icon({name, className='', ...props}) {
  const iconSrc = ICON_REGISTRY[name]; // 💡 Changed variable name for clarity

  if (!iconSrc) {
    console.warn(`Icon "${name}" does not exist in your assets registry.`);
    return null;
  }

  return (
    <img 
      src={iconSrc}                      // ✅ Render as a standard image source
      alt={`${name} icon`}               // ✅ Added for accessibility
      className={`nav-icon ${className}`} 
      {...props} 
    />
  );
}
