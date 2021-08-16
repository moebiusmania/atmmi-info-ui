
const Header = (): JSX.Element => {
  return (
    <header className="navbar mb-2 shadow-lg bg-primary text-white">
      {/* <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current text-success">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
      </div> */}
      <div className="flex-1 px-2 mx-2">
        <h1 className="text-lg font-bold">
          ATM Dashboard
        </h1>
      </div>
    </header>
  )
};

export default Header;