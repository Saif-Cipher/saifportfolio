"use client";

import { Fragment, type ElementType, type HTMLAttributes } from "react";
import { motion, useReducedMotion } from "motion/react";

interface TextRevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Element to render. Defaults to a paragraph. */
  as?: ElementType;
  /** Plain text only. Each word animates in on its own. */
  children: string;
  /** Seconds between words. */
  stagger?: number;
  /** Seconds before the first word starts. */
  delay?: number;
}

/**
 * Words rise and clear from a soft blur as the text enters the viewport,
 * one after another. Plain text only. Runs once, and shows the text
 * immediately when the visitor prefers reduced motion.
 */
export function TextReveal({
  as: Tag = "p",
  children,
  stagger = 0.035,
  delay = 0,
  ...rest
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const words = children.split(" ");

  return (
    <Tag {...rest}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, y: "0.55em", filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: reduce ? 0 : delay + index * stagger,
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export default TextReveal;
