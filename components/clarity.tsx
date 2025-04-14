//  eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { useEffect } from "react";

const Clarity = () => {
  useEffect(() => {
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          //  eslint-disable-next-line prefer-rest-params
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "r45pby9k0b");
  }, []);
  return <></>;
};

const PClarity = () => {
  if (process.env.NODE_ENV === "production") return <Clarity />;
  return null;
};

export default PClarity;
