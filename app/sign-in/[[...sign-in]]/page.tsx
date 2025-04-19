import { SignIn } from "@clerk/nextjs";
import { Shield, AlertTriangle, CreditCard, Users, Lock, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="text-lg font-bold">FraudGuard</span>
            </Link>
            <Link 
              href="/sign-up" 
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* Left side - Information */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-primary mb-3">
                Welcome to Fraud Management System
              </h1>
              <p className="text-base text-muted-foreground mb-6">
                Secure access to your fraud detection and prevention dashboard
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Advanced Security</h3>
                  <p className="text-sm text-muted-foreground">
                    State-of-the-art fraud detection and prevention system
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-primary/10 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Real-time Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant notifications for suspicious activities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Transaction Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive tracking of all financial activities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Customer Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    Safeguarding your customers' financial security
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Sign In Form */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-4">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none",
                    headerTitle: "text-xl font-bold text-primary",
                    headerSubtitle: "text-sm text-muted-foreground",
                    socialButtonsBlockButton: "border-primary/20 hover:bg-primary/5",
                    formButtonPrimary: "bg-primary hover:bg-primary/90",
                    footerActionLink: "text-primary hover:text-primary/90"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                <span className="text-base font-bold">FraudGuard</span>
              </div>
              <p className="text-xs opacity-80">
                Advanced fraud detection and prevention system for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/" className="text-xs opacity-80 hover:opacity-100 transition-opacity">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="text-xs opacity-80 hover:opacity-100 transition-opacity">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="text-xs opacity-80 hover:opacity-100 transition-opacity">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Contact Us</h3>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-xs opacity-80">
                  <Mail className="h-3 w-3" />
                  <span>support@fraudguard.com</span>
                </li>
                <li className="flex items-center gap-2 text-xs opacity-80">
                  <Phone className="h-3 w-3" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-xs opacity-80">
                  <MapPin className="h-3 w-3" />
                  <span>123 Security St, Safety City</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-4 pt-3 text-center text-xs opacity-80">
            <p>© {new Date().getFullYear()} FraudGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 