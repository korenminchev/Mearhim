"use client";

import { BoxProps, ButtonProps } from "@chakra-ui/react";
import { useState } from "react";
import { Button, Collapse, Box } from "@chakra-ui/react";

interface CollapsibleWidgetButtonProps {
  collapsedOnCaption?: string;
  collapsedOffCaption?: string;
  props?: ButtonProps;
}

interface CollapsibleWidgetProps {
  children: React.ReactNode;
  options?: BoxProps;
  buttonProps?: CollapsibleWidgetButtonProps;
}

export const CollapsibleWidget = ({
  children,
  options = {
    color: "black",
    bg: "white",
    rounded: "md",
    shadow: "md",
  },
  buttonProps = {
    collapsedOnCaption: "הצג מידע נוסף",
    collapsedOffCaption: "הסתר מידע נוסף",
    props: {
      colorScheme: "blue",
      variant: "solid",
      size: "sm",
    },
  },
}: CollapsibleWidgetProps) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <Box width={"inherit"}>
      <Button onClick={handleToggle} {...buttonProps.props}>
        {show ? buttonProps.collapsedOffCaption : buttonProps.collapsedOnCaption}
      </Button>
      <Collapse in={show} animateOpacity>
        <Box mt={4} p={4} {...options}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CollapsibleWidget;
