const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 py-6 md:py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg">Cookie Snitcher</h3>
          <p className="text-gray-400 text-sm">
            A modern web app to track and display cookies captured by the Cookie
            Snitcher Chrome Extension.
          </p>
        </div>

        <div className="text-center md:text-right text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Cookie Snitcher. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;