import { useEffect, useRef } from "react";

const useScrollReveal = (options = { threshold: 0.2 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // animate once
        }
      },
      options
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return ref;
};

export default useScrollReveal;
