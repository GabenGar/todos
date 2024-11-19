import { Component, type ReactNode } from "react";
import { withRouter, type RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps {
  children?: ReactNode;
}

interface IState {}

class ScrollToTop extends Component<IProps, IState> {
  componentDidUpdate(prevProps: IProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
