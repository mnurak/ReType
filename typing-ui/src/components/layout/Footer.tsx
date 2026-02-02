import LinkComponent from "../ui/LinkComponent";

const Footer = () => {
  return (
    <>
      <div className="border-b p-3 flex items-center gap-6">
        <LinkComponent
          url="https://github.com/mnurak/ReType.git"
          name="</>github"
          target="_blank"
        ></LinkComponent>

        <LinkComponent url="contact" name="Contact" />
      </div>
    </>
  );
};

export default Footer;
