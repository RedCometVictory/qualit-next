import { FaRegSun, FaRegMoon } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { globalTheme } from "../redux/features/theme/themeSlice";

const ModeButton = () => {
  const dispatch = useDispatch();
  // const currentheme = useSelector(state => state.theme);
  // const { theme } = currentTheme;
  const { theme } = useSelector(state => state.theme);
  // const { theme } = currentTheme;

  const toggleTheme = (value) => {
    dispatch(globalTheme(value));
  };

  return (
    <div className="nav__theme-container">
      {theme && theme === 'light' ? <FaRegMoon className="nav__theme-btn" onClick={() => toggleTheme('dark')} /> : <FaRegSun className="nav__theme-btn" onClick={() => toggleTheme('light')} />}
    </div>
  )
};
export default ModeButton;