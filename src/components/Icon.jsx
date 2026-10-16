import HomeSvg from "../assets/rocket-solid-full.svg";
import MorningRoutineSvg from "../assets/sun-solid-full.svg";
import ToDoListSvg from "../assets/list-check-solid-full.svg";
import NightTimeRoutineSvg from "../assets/moon-solid-full.svg";
import SettingsSvg from "../assets/gear-solid-full.svg";
import WhySvg from "../assets/brain-solid-full.svg";
import ReportSvg from "../assets/chart-simple-solid-full.svg";
import ClaritySvg from "../assets/lightbulb-solid-full.svg";
import HidePasswordSvg from "../assets/eye-slash-solid-full.svg";
import ShowPasswordSvg from "../assets/eye-solid-full.svg";
import UserSvg from "../assets/circle-user-solid-full.svg";
import PasswordIconSvg from "../assets/key-solid-full.svg";
import EmailSvg from "../assets/envelope-solid-full.svg";
import LogoutSvg from "../assets/right-from-bracket-solid-full.svg";

const ICON_REGISTRY = {
  homeImage: HomeSvg,
  morningImage: MorningRoutineSvg,
  todoImage: ToDoListSvg,
  nightImage: NightTimeRoutineSvg,
  settingsImage: SettingsSvg,
  whyImage: WhySvg,
  reportImage: ReportSvg,
  clarityImage: ClaritySvg,
  hidePasswordImage: HidePasswordSvg,
  showPasswordImage: ShowPasswordSvg,
  passwordIconImage: PasswordIconSvg,
  userImage: UserSvg,
  emailImage: EmailSvg,
  logoutImage: LogoutSvg,
};

export function Icon({ name, className = "", ...props }) {
  const iconSrc = ICON_REGISTRY[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" does not exist in your assets registry.`);
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt="" // Explicitly empty tells screen readers this icon is decorative
      className={`nav-icon ${className}`}
      {...props}
    />
  );
}
