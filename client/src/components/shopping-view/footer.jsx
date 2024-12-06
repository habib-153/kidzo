import { FacebookIcon, InstagramIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding Section */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold hover:text-blue-600 transition-colors duration-300">
            Kidzo
          </h2>
          <p>Trade License: TRAD/DSCC/042498/2021</p>
          <p>BIN Certificate: 05343824-0201</p>
          <p>DBID: 140609027</p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="transform hover:scale-125 transition-transform duration-300"
            >
              <i className="fab fa-facebook text-xl hover:text-blue-600"><FacebookIcon/></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="transform hover:scale-125 transition-transform duration-300"
            >
              <i className="fab fa-instagram text-xl hover:text-pink-600"><InstagramIcon/></i>
            </a>
          </div>
        </div>

        {/* Policies Section */}
        <div>
          <h3 className="text-lg font-bold mb-2">Policies</h3>
          <ul className="space-y-2">
            {[
              {
                title: "About Us",
                link: "about-us",
              },
              {
                title: "Privacy Policy",
                link: "#",
              },
              {
                title: "Return & Refund Policy",
                link: "#",
              },
              {
                title: "Terms and Condition",
                link: "#",
              },
              {
                title: "Shipping & Delivery Policy",
                link: "#",
              },
            ].map((item) => (
              <li className="w-fit" key={item.title}>
                <a
                  href={item.link}
                  className="text-gray-700 relative group flex items-center
                   hover:text-black hover:font-semibold transition-all duration-300 ease-in-out
                   hover:pl-2 hover:underline hover:-translate-y-0.5 transform
                   before:content-[''] before:absolute before:w-0 before:h-0.5
                   before:bottom-0 before:left-0 before:bg-black
                   before:transition-all before:duration-300
                   group-hover:before:w-fit"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Information Section */}
        <div>
          <h3 className="text-lg font-bold mb-2">Information</h3>
          <ul className="space-y-2">
            {[
              { title: "Payment Policy", link: "#" },
              { title: "FAQs", link: "#" },
              { title: "Contact Us", link: "#" },
            ].map((item) => (
              <li className="w-fit" key={item.title}>
                <a
                  href={item.link}
                  className="text-gray-700 relative group flex items-center
                  hover:text-black hover:font-semibold transition-all duration-300 ease-in-out
                  hover:pl-2 hover:underline hover:-translate-y-0.5 transform
                  before:content-[''] before:absolute before:w-0 before:h-0.5
                  before:bottom-0 before:left-0 before:bg-black
                  before:transition-all before:duration-300
                  group-hover:before:w-full"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold mb-2">Contact</h3>
          <p className="hover:bg-white hover:shadow-md p-2 rounded transition-all duration-300">
            <strong>Phone:</strong> +8801971-113460
            <br />
            <strong>Email:</strong> zuqowear@gmail.com
          </p>
          <p className="hover:bg-white hover:shadow-md p-2 rounded transition-all duration-300">
            <strong>Dhanmondi Outlet:</strong> Shop-321, 3rd floor, Metro
            Shopping Mall, Dhanmondi-32, Dhaka.
          </p>
        </div>
      </div>
      <div className="bg-gray-200 py-4 mt-8 text-center">
        <p className="text-sm text-gray-600">
          © 2024 kidzo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
