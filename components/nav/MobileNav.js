import { FaAngleRight, FaChevronRight } from "react-icons/fa";

const MobileNav = ({openMenu, setOpenMenu}) => {
  return (
    <div className="nav__mobile">
      <div className="mobile-btn">
        <FaChevronRight className={`chevron-btn ${openMenu ? "active" : ""}`} onClick={() => setOpenMenu()} />
      </div>
      <div className="mobile-btn hidden">
        <FaChevronRight />
      </div>
      <div className="mobile-btn hidden">
        <FaChevronRight />
      </div>
    </div>
  )
};
export default MobileNav;