
const Footer = (): JSX.Element => {
  const today = new Date();

  return (
    <footer className="text-center py-6">
      <p className="font-light text-sm">
        <span>{today.getFullYear()}</span> - Sviluppato da <a 
            href="https://github.com/moebiusmania/atmmi-info-ui" 
            target="_blank"
            className="underline" 
            rel="noopener noreferrer">
          Salvatore Laisa</a>
      </p>
      <p className="font-light text-sm mt-3">
        Progetto indipendente e non affiliato o supportato da ATM Milano S.p.A. 
      </p>
    </footer>
  )
};

export default Footer;