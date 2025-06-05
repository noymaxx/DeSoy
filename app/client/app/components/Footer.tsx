import Image from "next/image";
import { Github, Twitter, FileText, Book } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/desoy-logo.png"
                alt="deSoy Logo"
                width={128}
                height={32}
              />
            </div>
            <p className="text-gray-100 mb-4 max-w-md">
              Decentralized agricultural finance protocol connecting global
              capital with verified farmers through tokenized crop receivables.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/vict0rcarvalh0/eth-belgrade-hackathon/tree/main"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/vict0rcarvalh0/eth-belgrade-hackathon/tree/main"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://noymaxx.gitbook.io/desoy-1"
                  className="text-gray-100 hover:text-yellow-400 transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Whitepaper
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vict0rcarvalh0/eth-belgrade-hackathon/blob/main/README.md"
                  className="text-gray-100 hover:text-yellow-400 transition-colors flex items-center"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/soon"
                  className="text-gray-100 hover:text-yellow-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/soon"
                  className="text-gray-100 hover:text-yellow-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/soon"
                  className="text-gray-100 hover:text-yellow-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/soon"
                  className="text-gray-100 hover:text-yellow-400 transition-colors"
                >
                  Risk Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-100">
            © 2024 deSoy Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
