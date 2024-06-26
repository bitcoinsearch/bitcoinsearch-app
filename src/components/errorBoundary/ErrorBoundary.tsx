import Link from "next/link";
import React, { ErrorInfo } from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log({ error, errorInfo });
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex h-[calc(100vh-250px)] flex-col items-center justify-center">
          <div className="container flex items-center flex-col mx-auto max-w-xl space-y-6 text-center">
            <p className="text-3xl font-bold text-custom-primary-text md:text-5xl md:leading-[120%]">
              Oops, something went wrong!
            </p>
            <Link
              href="/"
              className="rounded-2xl bg-transparent border border-custom-accent gap-3 lg:gap-6 py-[18px] lg:py-6 3xl:py-9 px-4 lg:px-5 3xl:px-8 text-custom-accent hover:bg-custom-accent hover:text-white flex items-center justify-center text-[18px] lg:text-2xl 3xl:text-[32px] font-semibold w-fit"
            >
              Go back home
            </Link>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
