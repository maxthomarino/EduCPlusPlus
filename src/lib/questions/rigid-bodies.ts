import type { Question } from "./types";

export const questions: Question[] = [
  // ── State & Properties ──────────────────────────────────────────────
  {
    id: 1557,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question: "In physics simulation, what is a rigid body?",
    options: [
      "Any 3D mesh that has collision detection enabled",
      "A body whose mass is distributed uniformly throughout its volume",
      "An idealised solid whose shape never deforms — the distance between any two points on it remains constant",
      "A physics object that cannot move or rotate",
    ],
    correctIndex: 2,
    explanation:
      "A rigid body is an idealisation where the body's shape does not change during simulation. The distance between any two points on the body remains fixed, meaning no bending, stretching, or compression occurs.",
  },
  {
    id: 1558,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "Which four state variables fully describe a rigid body's motion?",
    options: [
      "Position, orientation, linear velocity, angular velocity",
      "Position, mass, force, torque",
      "Linear velocity, angular velocity, acceleration, jerk",
      "Position, orientation, mass, inertia tensor",
    ],
    correctIndex: 0,
    explanation:
      "A rigid body's dynamic state is captured by its position (where it is), orientation (how it's rotated), linear velocity (how fast it's translating), and angular velocity (how fast it's spinning). Mass and inertia are properties, not state variables.",
  },
  {
    id: 1559,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "What is the key difference between mass and the inertia tensor for a rigid body?",
    options: [
      "Mass applies to dynamic objects; inertia applies only to static objects",
      "Mass resists changes in linear motion (a scalar); the inertia tensor resists changes in rotational motion (a 3×3 matrix)",
      "Mass is measured in kilograms; inertia is measured in Newtons",
      "They are the same concept — inertia is just another word for mass",
    ],
    correctIndex: 1,
    explanation:
      "Mass is a scalar that determines how much a body resists linear acceleration (F = ma). The inertia tensor is a 3×3 matrix that determines how much a body resists angular acceleration about each axis. They are the rotational and linear analogs of each other.",
  },
  {
    id: 1560,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "How is a rigid body's rotational inertia mathematically represented?",
    options: [
      "As a 3×3 symmetric matrix (the inertia tensor) that describes resistance to angular acceleration about each axis",
      "As a single scalar value equal to the body's mass times its radius squared",
      "As a 4×4 transformation matrix that encodes both mass and orientation",
      "As a 3D vector whose components are the moments of inertia about x, y, and z",
    ],
    correctIndex: 0,
    explanation:
      "The inertia tensor is a 3×3 symmetric matrix. Its diagonal elements are the moments of inertia about each axis, and its off-diagonal elements are the products of inertia. It fully captures how mass is distributed relative to each rotation axis.",
  },
  {
    id: 1561,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "Why do physics engines typically store inverse mass (1/m) and inverse inertia tensor (I⁻¹) rather than mass and inertia directly?",
    options: [
      "Because inverse values use less memory than their direct counterparts",
      "Because the inverse inertia tensor is always diagonal, making it simpler to store",
      "Because the GPU requires inverse values for parallel computation",
      "Because the equations of motion require division by mass/inertia, and storing the inverse avoids repeated division (and allows infinite mass via zero)",
    ],
    correctIndex: 3,
    explanation:
      "The core equations (a = F/m, α = I⁻¹τ) need the inverse of mass and inertia. Storing them pre-inverted avoids expensive division/matrix inversion every frame. Additionally, setting inverse mass to zero naturally represents an object with infinite mass (static/immovable).",
  },
  {
    id: 1562,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "How is a static (immovable) rigid body typically represented in a physics engine?",
    options: [
      "By removing it from the physics simulation loop entirely",
      "By setting its inverse mass and inverse inertia tensor to zero",
      "By setting its mass to zero",
      "By setting its velocity to zero each frame",
    ],
    correctIndex: 1,
    explanation:
      "Setting inverse mass to 0 means 1/m = 0, implying infinite mass. When the equation a = F × (1/m) is evaluated, acceleration is always zero regardless of applied force. The same logic applies to inverse inertia for rotations.",
  },

  // ── Spaces & Conventions ────────────────────────────────────────────
  {
    id: 1563,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "What is the difference between world space and body (local) space for a rigid body?",
    options: [
      "World space is the global coordinate system shared by all objects; body space is a coordinate system fixed to and rotating with the body",
      "World space uses metres; body space uses arbitrary units",
      "World space is 3D; body space is 2D",
      "World space is used for rendering; body space is used only for collision detection",
    ],
    correctIndex: 0,
    explanation:
      "World space is the single global coordinate frame in which all objects exist. Body space (local space) is attached to the rigid body and rotates with it. A point that is fixed in body space will move and rotate in world space as the body moves.",
  },
  {
    id: 1564,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "Why must angular velocity, torque, and the inverse inertia tensor all be expressed in the same coordinate space when computing angular acceleration?",
    options: [
      "Because mixing spaces would cause numerical overflow in floating-point arithmetic",
      "Because angular velocity is always defined in body space by convention",
      "Because the equation α = I⁻¹τ is a matrix-vector multiplication that is only valid when all quantities share the same basis",
      "Because the physics engine's collision detection requires all values in world space",
    ],
    correctIndex: 2,
    explanation:
      "The equation α = I⁻¹τ involves multiplying a matrix by a vector. For this multiplication to be physically meaningful, both the matrix (I⁻¹) and the vector (τ) must be expressed in the same coordinate frame. Mixing spaces produces incorrect results.",
  },
  {
    id: 1565,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "Given a body-space inertia tensor I_body and a rotation matrix R representing the body's orientation, how do you compute the world-space inertia tensor?",
    options: [
      "I_world = R · I_body · Rᵀ",
      "I_world = Rᵀ · I_body · R",
      "I_world = R · I_body",
      "I_world = I_body · R",
    ],
    correctIndex: 0,
    explanation:
      "The similarity transform I_world = R · I_body · Rᵀ rotates the inertia tensor from body space into world space. R rotates body-space vectors to world space, and Rᵀ (the transpose/inverse for rotation matrices) rotates back. This sandwich product correctly transforms the tensor.",
  },

  // ── Forces & Torques ────────────────────────────────────────────────
  {
    id: 1566,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "What is Newton's second law expressed as the equation for force on a rigid body?",
    options: [
      "F = ma (force equals mass times acceleration)",
      "F = mv (force equals mass times velocity)",
      "F = mα (force equals mass times angular acceleration)",
      "F = Iα (force equals inertia times angular acceleration)",
    ],
    correctIndex: 0,
    explanation:
      "Newton's second law states F = ma: the net force on a body equals its mass multiplied by its linear acceleration. This governs translational (linear) motion. The rotational analog is τ = Iα.",
  },
  {
    id: 1567,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "What is the equation for a rigid body's linear acceleration given net force F and mass m?",
    options: [
      "a = m / F",
      "a = F × m",
      "a = F / m",
      "a = F · v",
    ],
    correctIndex: 2,
    explanation:
      "Rearranging F = ma gives a = F/m. The linear acceleration of a body is the net force divided by its mass. In engines storing inverse mass, this becomes a = F × (1/m).",
  },
  {
    id: 1568,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "What is the equation relating torque (τ), the inertia tensor (I), and angular acceleration (α) for a rigid body?",
    options: [
      "τ = mα",
      "τ = Iα",
      "τ = I/α",
      "τ = Fα",
    ],
    correctIndex: 1,
    explanation:
      "τ = Iα is the rotational analog of F = ma. The net torque on a body equals the inertia tensor multiplied by the angular acceleration. Rearranging gives α = I⁻¹τ, which is how angular acceleration is computed in practice.",
  },
  {
    id: 1569,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "What happens when a force is applied directly through a rigid body's centre of mass (COM)?",
    options: [
      "It produces only linear acceleration with no rotational effect (no torque)",
      "It produces only rotational acceleration with no linear effect",
      "It produces both linear and rotational acceleration equally",
      "It has no effect because forces at the COM cancel out",
    ],
    correctIndex: 0,
    explanation:
      "A force through the COM has a zero moment arm (r = 0), so the torque τ = r × F = 0. The body accelerates linearly but does not rotate. Any off-centre force, by contrast, also generates torque.",
  },
  {
    id: 1570,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "Why does applying a force at a point away from the centre of mass produce torque on a rigid body?",
    options: [
      "Because off-centre forces are automatically converted into angular velocity by the physics engine",
      "Because the force is partially absorbed by the body's inertia, leaving a rotational residual",
      "Because the body's shape redirects the linear force into angular momentum",
      "Because the offset from the COM creates a non-zero moment arm, and torque equals the cross product of the moment arm and the force (τ = r × F)",
    ],
    correctIndex: 3,
    explanation:
      "Torque is computed as τ = r × F, where r is the vector from the COM to the point of force application. When the force is applied away from the COM, r ≠ 0, producing a non-zero cross product and therefore a torque that causes angular acceleration.",
  },
  {
    id: 1571,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "In the torque equation τ = r × F, what does the vector r represent?",
    options: [
      "The displacement vector from the centre of mass to the point where the force is applied",
      "The radius of the rigid body's bounding sphere",
      "The body's angular velocity vector",
      "The direction of the resultant torque",
    ],
    correctIndex: 0,
    explanation:
      "r is the moment arm — the vector from the body's centre of mass to the point of force application. The cross product r × F gives the torque vector, whose direction is the axis of rotation and whose magnitude depends on the length of r, the magnitude of F, and the angle between them.",
  },
  {
    id: 1572,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "What is a force accumulator in a rigid body simulation, and why is it cleared each timestep?",
    options: [
      "A buffer that stores the history of all forces ever applied to the body",
      "A running total of all forces applied during a timestep; it is cleared so forces don't persist and compound from frame to frame",
      "A scalar that measures the total kinetic energy added by forces",
      "A special data structure that only accumulates gravitational forces",
    ],
    correctIndex: 1,
    explanation:
      "A force accumulator sums all forces (gravity, contacts, springs, etc.) applied to a body during a single timestep. After integration uses the total to compute acceleration, the accumulator is zeroed. If not cleared, forces from previous frames would keep adding up, causing ever-increasing acceleration.",
  },
  {
    id: 1573,
    difficulty: "Hard",
    topic: "Rigid Bodies",
    question:
      "What happens when you apply equal and opposite forces at two different points on a rigid body?",
    options: [
      "Both forces cancel completely — no translation and no rotation occurs",
      "The body translates in the direction of whichever force is closer to the COM",
      "The linear forces cancel out (no net translation), but a net torque remains, causing pure rotation (a couple)",
      "The body translates and rotates simultaneously because the forces don't fully cancel",
    ],
    correctIndex: 2,
    explanation:
      "Equal and opposite forces produce zero net force, so there is no linear acceleration. However, because they act at different points, each produces a torque about the COM, and these torques add rather than cancel. This is called a force couple and results in pure rotation.",
  },

  // ── Integration ─────────────────────────────────────────────────────
  {
    id: 1574,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "What is semi-implicit (symplectic) Euler integration, and why is it preferred over explicit Euler for physics simulation?",
    options: [
      "It updates velocity first using the current force, then updates position using the new velocity; this better conserves energy and is more stable",
      "It updates position first, then velocity, which avoids numerical drift",
      "It uses the average of the current and next velocity to update position, achieving second-order accuracy",
      "It runs two explicit Euler steps and averages them for improved accuracy",
    ],
    correctIndex: 0,
    explanation:
      "Semi-implicit Euler first updates v(t+dt) = v(t) + a·dt, then updates x(t+dt) = x(t) + v(t+dt)·dt. By using the newly computed velocity (not the old one) for the position update, it achieves better energy conservation and stability than explicit Euler, which uses old velocity for both.",
  },
  {
    id: 1575,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "In semi-implicit Euler, why is it important to update velocities before updating positions?",
    options: [
      "Updating velocities first is faster because the CPU can pipeline the instructions",
      "It ensures that static bodies remain at rest",
      "The order doesn't actually matter — it's just a convention",
      "Using the newly computed velocity for the position update introduces a symplectic property that better conserves energy over time",
    ],
    correctIndex: 3,
    explanation:
      "By updating velocity first (v_new = v + a·dt) and then using v_new to update position (x_new = x + v_new·dt), the integrator becomes symplectic. This means it approximately conserves the total energy of the system over long time periods, whereas explicit Euler (which uses v_old for position) tends to gain energy and become unstable.",
  },
  {
    id: 1576,
    difficulty: "Hard",
    topic: "Rigid Bodies",
    question:
      "How do you update a rigid body's quaternion orientation q given an angular velocity ω and timestep dt?",
    options: [
      "q_new = q + dt · ω",
      "q_new = q + (dt/2) · [0, ω] · q, where [0, ω] is a quaternion with zero scalar part and ω as the vector part",
      "q_new = q · R(ω · dt), where R converts an axis-angle to a rotation matrix",
      "q_new = normalize(q + ω)",
    ],
    correctIndex: 1,
    explanation:
      "The quaternion derivative is dq/dt = ½ · [0, ω] · q, where [0, ω] is the pure quaternion formed from the angular velocity vector. Integrating with Euler gives q_new = q + (dt/2) · [0, ω] · q. The result must then be normalized to keep it a unit quaternion.",
  },
  {
    id: 1577,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "Why must you normalize the quaternion after each integration step?",
    options: [
      "Because numerical integration introduces small errors that cause the quaternion to drift away from unit length, and non-unit quaternions do not represent valid rotations",
      "Because quaternion multiplication always doubles the quaternion's magnitude",
      "Because the angular velocity is unbounded and can make the quaternion arbitrarily large",
      "Because normalization converts the quaternion from body space to world space",
    ],
    correctIndex: 0,
    explanation:
      "Quaternions must have unit length (|q| = 1) to represent valid 3D rotations. Each integration step introduces floating-point errors that gradually increase the quaternion's magnitude. Without renormalization, the quaternion would drift from unit length, producing skewed or scaled transforms instead of pure rotations.",
  },

  // ── Damping & Timestep ──────────────────────────────────────────────
  {
    id: 1578,
    difficulty: "Easy",
    topic: "Rigid Bodies",
    question:
      "What is damping in the context of rigid body simulation, and why is it used?",
    options: [
      "A method of increasing friction between colliding bodies",
      "A technique to slow down the simulation's timestep when the CPU is overloaded",
      "An artificial reduction of velocity each timestep that removes energy, preventing unrealistic perpetual motion and improving stability",
      "A way of smoothing out collision responses over multiple frames",
    ],
    correctIndex: 2,
    explanation:
      "Damping artificially reduces a body's linear and angular velocity each frame, simulating energy loss due to effects like air resistance that aren't explicitly modelled. Without damping, objects would drift and spin indefinitely due to the lack of natural energy dissipation in simplified simulations.",
  },
  {
    id: 1579,
    difficulty: "Hard",
    topic: "Rigid Bodies",
    question:
      "Why is the exponential damping form v · e^(−k·Δt) preferred over the simpler v · (1 − k·Δt)?",
    options: [
      "Because it is timestep-independent — it produces the same damping effect regardless of the size of Δt, whereas the linear form behaves differently at different timesteps",
      "Because it is computationally cheaper than the linear form",
      "Because it guarantees that velocity reaches exactly zero after a fixed number of frames",
      "Because it only damps velocities above a certain threshold, preserving slow motion",
    ],
    correctIndex: 0,
    explanation:
      "The linear form v·(1 − k·Δt) is an approximation that behaves differently depending on the timestep size and can even produce negative velocities if k·Δt > 1. The exponential form v·e^(−k·Δt) correctly decays velocity regardless of Δt, making the damping framerate-independent and always positive.",
  },
  {
    id: 1580,
    difficulty: "Medium",
    topic: "Rigid Bodies",
    question:
      "Why is a fixed timestep preferred over a variable timestep in physics simulation?",
    options: [
      "Because variable timesteps are not supported by modern CPUs",
      "Because it makes the simulation deterministic and prevents instability from large variable time steps",
      "Because fixed timesteps automatically run faster than variable ones",
      "Because variable timesteps cause objects to gain mass over time",
    ],
    correctIndex: 1,
    explanation:
      "A fixed timestep ensures consistent, reproducible behaviour — the same inputs always produce the same outputs. Variable timesteps can cause instability (large dt → large forces → objects tunnelling through each other) and make debugging difficult because results change depending on frame rate.",
  },
  {
    id: 1581,
    difficulty: "Hard",
    topic: "Rigid Bodies",
    question:
      'What is the "spiral of death" in a physics simulation, and how do you prevent it?',
    options: [
      "When objects rotate faster and faster due to uncapped angular velocity; prevent it by clamping angular velocity",
      "When two objects continuously collide and bounce with increasing energy; prevent it by using restitution less than 1",
      "When numerical integration error causes orbiting objects to spiral inward; prevent it by using a higher-order integrator",
      "When the simulation takes longer than Δt to compute, it accumulates ever-growing lag that makes each frame even slower; prevent it by capping the number of physics substeps per frame",
    ],
    correctIndex: 3,
    explanation:
      "If physics computation takes longer than the fixed Δt, the game falls behind. It then needs to run even more physics steps to catch up, which takes even longer, creating a feedback loop. The solution is to cap the maximum number of substeps per frame (e.g., max 4), accepting a temporary slowdown rather than a total freeze.",
  },
];
