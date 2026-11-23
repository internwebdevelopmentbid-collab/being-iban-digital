import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const GOLD = "#c9a66b";

const NODES = [
  {
    id: "brand",
    label: "BRAND",
    description: "Build a distinct identity people remember.",
    x: 48,
    y: 48,
    size: "core",
  },
  {
    id: "content",
    label: "CONTENT",
    description: "Turn ideas into stories that earn attention.",
    x: 21,
    y: 22,
  },
  {
    id: "social",
    label: "SOCIAL",
    description: "Create conversations around your brand.",
    x: 9,
    y: 57,
  },
  {
    id: "creative",
    label: "CREATIVE",
    description: "Make the message impossible to ignore.",
    x: 30,
    y: 81,
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    description: "Put your budget where it can perform.",
    x: 70,
    y: 16,
  },
  {
    id: "search",
    label: "SEARCH",
    description: "Capture intent when people are looking.",
    x: 91,
    y: 39,
  },
  {
    id: "data",
    label: "DATA",
    description: "Turn signals into better decisions.",
    x: 78,
    y: 73,
  },
  {
    id: "conversion",
    label: "CONVERSION",
    description: "Turn attention into measurable action.",
    x: 55,
    y: 91,
  },
  {
    id: "strategy",
    label: "STRATEGY",
    description: "Connect the right decisions into one direction.",
    x: 38,
    y: 10,
  },
  {
    id: "growth",
    label: "GROWTH",
    description: "Compound attention into sustainable momentum.",
    x: 87,
    y: 87,
  },
];

const NODE_MAP = Object.fromEntries(NODES.map((node) => [node.id, node]));

const CONNECTIONS = [
  ["strategy", "content"],
  ["strategy", "performance"],
  ["strategy", "brand"],
  ["content", "brand"],
  ["content", "social"],
  ["content", "creative"],
  ["social", "brand"],
  ["social", "creative"],
  ["creative", "brand"],
  ["creative", "conversion"],
  ["brand", "performance"],
  ["brand", "data"],
  ["brand", "conversion"],
  ["performance", "search"],
  ["performance", "data"],
  ["search", "data"],
  ["search", "conversion"],
  ["data", "conversion"],
  ["data", "growth"],
  ["conversion", "growth"],
];

const StrategyConstellation = () => {
  const [activeNode, setActiveNode] = useState(null);

  const activeConnections = useMemo(() => {
    if (!activeNode) return [];

    return CONNECTIONS.filter(
      ([from, to]) => from === activeNode || to === activeNode,
    );
  }, [activeNode]);

  const connectedNodeIds = useMemo(() => {
    if (!activeNode) return null;

    const connected = new Set([activeNode]);

    activeConnections.forEach(([from, to]) => {
      connected.add(from);
      connected.add(to);
    });

    return connected;
  }, [activeNode, activeConnections]);

  const activeNodeData = activeNode ? NODE_MAP[activeNode] : null;

  return (
    <div
      className="
        relative
        mx-auto
        h-[520px]
        w-full
        max-w-[780px]
        overflow-visible
        bg-transparent

        max-[850px]:h-[500px]
        max-[850px]:max-w-[680px]

        max-[700px]:h-[470px]
        max-[700px]:max-w-[620px]

        max-[550px]:h-[430px]
        max-[550px]:max-w-[520px]

        max-[450px]:h-[390px]
        max-[450px]:max-w-[460px]

        max-[390px]:h-[350px]
        max-[390px]:max-w-[420px]
      "
      onMouseLeave={() => setActiveNode(null)}
    >
      {/* AMBIENT LIGHT */}

      <div
        className="
          pointer-events-none
          absolute
          left-[27%]
          top-[20%]
          h-[390px]
          w-[390px]
          rounded-full
          bg-[rgba(201,166,107,0.13)]
          blur-[115px]

          max-[550px]:h-[300px]
          max-[550px]:w-[300px]

          max-[390px]:h-[250px]
          max-[390px]:w-[250px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[10%]
          bottom-[8%]
          h-[230px]
          w-[230px]
          rounded-full
          bg-[rgba(201,166,107,0.055)]
          blur-[90px]

          max-[550px]:h-[170px]
          max-[550px]:w-[170px]
        "
      />

      {/* GRID */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-[-5%]
          opacity-50
          [background-image:linear-gradient(to_right,rgba(201,166,107,0.065)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,166,107,0.065)_1px,transparent_1px)]
          [background-size:78px_78px]
          [mask-image:radial-gradient(ellipse_at_center,black_0%,black_38%,transparent_78%)]

          max-[550px]:[background-size:60px_60px]
          max-[390px]:[background-size:52px_52px]
        "
      />

      {/* HEADER */}

      <div
        className="
          absolute
          left-[3%]
          top-[3%]
          z-40
        "
      >
        <div className="flex items-center gap-3">
          <span
            className="h-px w-10"
            style={{
              backgroundColor: "rgba(201,166,107,0.72)",
            }}
          />

          <span
            className="
              font-mono
              text-[10px]
              uppercase
              tracking-[0.34em]
            "
            style={{
              color: "rgba(201,166,107,0.68)",
            }}
          >
            Digital ecosystem
          </span>
        </div>
      </div>

      {/* STATUS */}

      <div
        className="
          absolute
          right-[3%]
          top-[3%]
          z-40
        "
      >
        <div className="flex items-center gap-2">
          <span
            className="
              constellation-status-dot
              h-[6px]
              w-[6px]
              rounded-full
              bg-[#c9a66b]
              shadow-[0_0_14px_rgba(201,166,107,0.8)]
            "
          />

          <span
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.28em]
              text-[rgba(245,243,238,0.36)]
            "
          >
            Connected
          </span>
        </div>
      </div>

      {/* ROTATING ORBIT */}

      <div
        className="
          constellation-orbit
          pointer-events-none
          absolute
          left-[48%]
          top-[50%]
          z-[2]
          h-[475px]
          w-[475px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[rgba(201,166,107,0.13)]

          max-[550px]:h-[390px]
          max-[550px]:w-[390px]

          max-[450px]:h-[350px]
          max-[450px]:w-[350px]

          max-[390px]:h-[315px]
          max-[390px]:w-[315px]
        "
      >
        <span
          className="
            absolute
            left-1/2
            top-0
            h-[6px]
            w-[6px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#c9a66b]
          "
          style={{
            boxShadow: "0 0 16px rgba(201,166,107,0.9)",
          }}
        />
      </div>

      <div
        className="
          pointer-events-none
          absolute
          left-[48%]
          top-[50%]
          z-[2]
          h-[340px]
          w-[340px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[rgba(201,166,107,0.085)]

          max-[550px]:h-[285px]
          max-[550px]:w-[285px]

          max-[450px]:h-[250px]
          max-[450px]:w-[250px]

          max-[390px]:h-[220px]
          max-[390px]:w-[220px]
        "
      />

      {/* CROSSHAIR */}

      <div
        className="
          pointer-events-none
          absolute
          left-[48%]
          top-[50%]
          z-[3]
          h-px
          w-[370px]
          -translate-x-1/2
          -translate-y-1/2
          bg-[rgba(201,166,107,0.075)]

          max-[550px]:w-[310px]
          max-[450px]:w-[270px]
          max-[390px]:w-[235px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[48%]
          top-[50%]
          z-[3]
          h-[370px]
          w-px
          -translate-x-1/2
          -translate-y-1/2
          bg-[rgba(201,166,107,0.065)]

          max-[550px]:h-[310px]
          max-[450px]:h-[270px]
          max-[390px]:h-[235px]
        "
      />

      {/* CONNECTIONS */}

      <svg
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          h-full
          w-full
        "
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {CONNECTIONS.map(([fromId, toId]) => {
          const from = NODE_MAP[fromId];
          const to = NODE_MAP[toId];

          const active =
            activeNode && (fromId === activeNode || toId === activeNode);

          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="constellation-connection"
              stroke={GOLD}
              strokeWidth={active ? 0.28 : 0.12}
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: active ? 0.9 : activeNode ? 0.055 : 0.27,
              }}
            />
          );
        })}
      </svg>

      {/* ACTIVE SIGNALS */}

      {activeNode &&
        activeConnections.map(([fromId, toId]) => {
          const from = NODE_MAP[fromId];
          const to = NODE_MAP[toId];

          return (
            <motion.span
              key={`${fromId}-${toId}-signal`}
              initial={{
                left: `${from.x}%`,
                top: `${from.y}%`,
              }}
              animate={{
                left: [`${from.x}%`, `${to.x}%`],
                top: [`${from.y}%`, `${to.y}%`],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                pointer-events-none
                absolute
                z-[18]
                h-[6px]
                w-[6px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#c9a66b]
              "
              style={{
                boxShadow: "0 0 18px rgba(201,166,107,0.95)",
              }}
            />
          );
        })}

      {/* NODES */}

      {NODES.map((node) => {
        const active = activeNode === node.id;

        const connected = !connectedNodeIds || connectedNodeIds.has(node.id);

        const isCore = node.size === "core";

        return (
          <motion.button
            key={node.id}
            type="button"
            onMouseEnter={() => setActiveNode(node.id)}
            onFocus={() => setActiveNode(node.id)}
            onBlur={() => setActiveNode(null)}
            animate={{
              opacity: connected ? 1 : 0.16,
              scale: active ? 1.1 : 1,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              z-20
              -translate-x-1/2
              -translate-y-1/2
              outline-none
            "
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          >
            {active && (
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="
                  absolute
                  inset-[-12px]
                  rounded-full
                  border
                  border-[rgba(201,166,107,0.48)]
                "
              />
            )}

            <span
              className={[
                "relative flex items-center justify-center rounded-full border",
                "transition-all duration-300",
                isCore
                  ? `
                    h-[96px]
                    w-[96px]

                    sm:h-[112px]
                    sm:w-[112px]

                    max-[550px]:h-[82px]
                    max-[550px]:w-[82px]

                    max-[390px]:h-[72px]
                    max-[390px]:w-[72px]
                  `
                  : `
                    h-[50px]
                    w-[50px]

                    sm:h-[58px]
                    sm:w-[58px]

                    max-[550px]:h-[44px]
                    max-[550px]:w-[44px]

                    max-[390px]:h-[40px]
                    max-[390px]:w-[40px]
                  `,
                active
                  ? "border-[rgba(201,166,107,0.95)] bg-[rgba(201,166,107,0.09)]"
                  : "border-[rgba(201,166,107,0.38)] bg-[rgba(8,9,7,0.25)]",
              ].join(" ")}
              style={{
                boxShadow: active
                  ? "0 0 28px rgba(201,166,107,0.16)"
                  : "0 0 18px rgba(201,166,107,0.025)",
              }}
            >
              {isCore && (
                <span
                  className="
                    constellation-core-glow
                    absolute
                    h-12
                    w-12
                    rounded-full
                    bg-[rgba(201,166,107,0.12)]
                    blur-xl

                    max-[550px]:h-10
                    max-[550px]:w-10
                  "
                />
              )}

              <span
                className={[
                  "relative rounded-full transition-all duration-300",
                  isCore ? "h-3.5 w-3.5" : "h-2 w-2",
                  active ? "bg-[#c9a66b]" : "bg-[rgba(201,166,107,0.72)]",
                ].join(" ")}
                style={{
                  boxShadow: active
                    ? "0 0 20px rgba(201,166,107,1)"
                    : "0 0 9px rgba(201,166,107,0.45)",
                }}
              />
            </span>

            <span
              className={[
                "absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap",
                "font-mono text-[10px] uppercase tracking-[0.24em]",
                "transition-all duration-300 sm:text-[11px]",
                active ? "text-[#f5f3ee]" : "text-[rgba(245,243,238,0.52)]",
                "max-[550px]:mt-2 max-[550px]:text-[8px]",
                "max-[390px]:text-[7px]",
              ].join(" ")}
            >
              {node.label}
            </span>
          </motion.button>
        );
      })}

      {/* ACTIVE INFORMATION */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[4%]
          left-[3%]
          z-40
          max-w-[320px]

          max-[550px]:bottom-[2%]
          max-[550px]:max-w-[250px]
        "
      >
        <AnimatePresence mode="wait">
          {activeNodeData ? (
            <motion.div
              key={activeNode}
              initial={{
                opacity: 0,
                y: 7,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              transition={{
                duration: 0.22,
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="
                    h-[5px]
                    w-[5px]
                    rounded-full
                    bg-[#c9a66b]
                  "
                  style={{
                    boxShadow: "0 0 12px rgba(201,166,107,0.8)",
                  }}
                />

                <span
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.28em]
                    text-[#c9a66b]
                  "
                >
                  {activeNodeData.label}
                </span>
              </div>

              <p
                className="
                  max-w-[300px]
                  text-[12px]
                  leading-6
                  text-[rgba(245,243,238,0.52)]

                  max-[550px]:text-[10px]
                  max-[550px]:leading-5
                "
              >
                {activeNodeData.description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-[rgba(245,243,238,0.32)]

                max-[550px]:text-[8px]
              "
            >
              Explore the ecosystem
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INDEX */}

      <div
        className="
          absolute
          bottom-[4%]
          right-[3%]
          z-40
          font-mono
          text-[9px]
          tracking-[0.25em]
          text-[rgba(201,166,107,0.38)]

          max-[550px]:bottom-[2%]
          max-[550px]:text-[8px]
        "
      >
        10 / 10
      </div>
    </div>
  );
};

export default StrategyConstellation;
