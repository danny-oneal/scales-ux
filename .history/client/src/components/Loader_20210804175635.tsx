import React, { FunctionComponent, ReactNode } from "react";
import { SpinnerProps, Spinner } from "react-bootstrap";

interface Props extends SpinnerProps {
  isVisible: boolean;
  children: JSX.Element;
}

const Loader: FunctionComponent<Props> = (props: Props) => {
  const { isVisible = false, animation, variant, size = "", children } = props;

  if (isVisible) {
    return <Spinner animation={animation} variant={variant} />;
  }

  return children;
};

export default Loader;