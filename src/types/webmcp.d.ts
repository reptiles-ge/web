import "react";

declare module "react" {
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    tooldescription?: string;
    toolname?: string;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparamdescription?: string;
  }
}
