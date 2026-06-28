const EXERCISES_DATABASE = [
  // WARMUPS (No equipment required for standard warmups)
  {
    id: "warmup_arm_circles",
    name: "Arm Circles",
    equipment: "none",
    type: "warmup",
    target: "Shoulders & Arms",
    description: "Dynamic stretch to warm up shoulder joints and improve range of motion.",
    steps: [
      "Stand tall with feet shoulder-width apart.",
      "Extend your arms straight out to the sides at shoulder height, palms down.",
      "Slowly draw small circles in the air, gradually increasing the size.",
      "Reverse the direction after half the duration."
    ],
    duration: 30,
    caloriesPerMin: 3
  },
  {
    id: "warmup_torso_twists",
    name: "Torso Twists",
    equipment: "none",
    type: "warmup",
    target: "Core & Spine",
    description: "Mobilizes the spine and warms up the abdominal muscles.",
    steps: [
      "Stand with feet shoulder-width apart, knees slightly bent.",
      "Bring hands to chest level with elbows bent.",
      "Gently rotate your torso from side to side, letting your head and hips move naturally.",
      "Keep the movement controlled and fluid."
    ],
    duration: 30,
    caloriesPerMin: 2.5
  },
  {
    id: "warmup_hip_rotations",
    name: "Hip Rotations",
    equipment: "none",
    type: "warmup",
    target: "Hips & Lower Back",
    description: "Loosens up the hip joints and lower back muscles.",
    steps: [
      "Stand with feet slightly wider than shoulder-width, hands on your hips.",
      "Push your hips forward, to the right, backward, and to the left in a smooth circular motion.",
      "Perform circular movements clockwise, then counter-clockwise.",
      "Maintain a tall posture and soft knees."
    ],
    duration: 30,
    caloriesPerMin: 2
  },
  {
    id: "warmup_dynamic_chest_stretch",
    name: "Dynamic Chest Stretch",
    equipment: "none",
    type: "warmup",
    target: "Chest & Back",
    description: "Dynamically stretches the chest and activates upper back muscles.",
    steps: [
      "Stand straight, arms extended forward at chest height, palms together.",
      "Swing your arms out wide to the sides, squeezing your shoulder blades together.",
      "Return to the starting position and repeat in a steady rhythmic tempo."
    ],
    duration: 30,
    caloriesPerMin: 3
  },

  // MACHINES
  {
    id: "mach_chest_press",
    name: "Machine Chest Press",
    equipment: "machines",
    type: "strength",
    target: "Chest",
    description: "Standard machine exercise targeting the pectoral muscles with guided safety.",
    steps: [
      "Adjust the seat height so handles align with mid-chest level.",
      "Sit back firmly, feet flat on the floor, and grasp the handles.",
      "Push handles forward until arms are extended but not locked out, exhaling.",
      "Slowly return the handles back to chest level, inhaling."
    ],
    duration: 40,
    caloriesPerMin: 6
  },
  {
    id: "mach_lat_pulldown",
    name: "Machine Lat Pulldown",
    equipment: "machines",
    type: "strength",
    target: "Back",
    description: "Guided cable pulldown to develop upper back breadth and strength.",
    steps: [
      "Adjust the thigh pads so your legs are locked securely in place.",
      "Grasp the bar with a wide overhand grip.",
      "Lean back slightly, pull the bar down to your upper chest while driving elbows down.",
      "Slowly release the bar back up to full extension."
    ],
    duration: 40,
    caloriesPerMin: 5.5
  },
  {
    id: "mach_leg_press",
    name: "Machine Leg Press",
    equipment: "machines",
    type: "strength",
    target: "Legs",
    description: "Compound machine lift targeting quadriceps, glutes, and hamstrings.",
    steps: [
      "Sit in the machine, placing feet shoulder-width apart on the sled platform.",
      "Lower the safety handles and slowly bend your knees to a 90-degree angle.",
      "Push the platform away using your heels, extending legs without locking knees.",
      "Control the descent back to starting position."
    ],
    duration: 45,
    caloriesPerMin: 7
  },
  {
    id: "mach_cable_row",
    name: "Seated Cable Row",
    equipment: "machines",
    type: "strength",
    target: "Back",
    description: "Horizontal pull machine exercise to build mid-back thickness.",
    steps: [
      "Sit on the bench, knees slightly bent, feet resting on foot platforms.",
      "Grasp the double-D handle, sit tall with arms extended and chest lifted.",
      "Pull the handle towards your lower ribcage, squeezing shoulder blades together.",
      "Slowly return the weight, extending your arms fully while keeping your back straight."
    ],
    duration: 40,
    caloriesPerMin: 6
  },

  // DUMBBELLS
  {
    id: "db_goblet_squat",
    name: "Dumbbell Goblet Squat",
    equipment: "dumbbells",
    type: "strength",
    target: "Legs",
    description: "A highly effective lower-body compound exercise prioritizing upright posture.",
    steps: [
      "Stand with feet slightly wider than shoulder-width, toes angled out.",
      "Hold a dumbbell vertically by one end close to your chest, elbows tucked down.",
      "Inhale, push your hips back, and lower into a deep squat, elbows inside knees.",
      "Exhale and drive through heels to return to standing position."
    ],
    duration: 40,
    caloriesPerMin: 7.5
  },
  {
    id: "db_bench_press",
    name: "Dumbbell Flat Bench Press",
    equipment: "dumbbells",
    type: "strength",
    target: "Chest",
    description: "Builds chest and tricep strength while recruiting stabilization muscles.",
    steps: [
      "Sit on a flat bench with dumbbells resting on your thighs.",
      "Lie back, bringing weights to your shoulders with palms facing forward.",
      "Exhale as you press the dumbbells straight up above your chest.",
      "Inhale, lowering the weights slowly until elbows are just below the bench height."
    ],
    duration: 40,
    caloriesPerMin: 6.5
  },
  {
    id: "db_bicep_curl",
    name: "Dumbbell Alternating Bicep Curl",
    equipment: "dumbbells",
    type: "strength",
    target: "Arms",
    description: "Isolation exercise to target and sculpt the biceps.",
    steps: [
      "Stand tall, holding a dumbbell in each hand, arms extended, palms facing forward.",
      "Keep elbows close to your torso; curl the weight in one arm toward your shoulder.",
      "Squeeze the bicep, then slowly lower the dumbbell back down.",
      "Alternate to the opposite arm and repeat."
    ],
    duration: 35,
    caloriesPerMin: 4.5
  },
  {
    id: "db_shoulder_press",
    name: "Dumbbell Overhead Shoulder Press",
    equipment: "dumbbells",
    type: "strength",
    target: "Shoulders",
    description: "Develops shoulder stability and strength in the vertical pressing plane.",
    steps: [
      "Sit or stand with feet shoulder-width apart, holding dumbbells at shoulder level.",
      "Keep elbows pointing slightly forward, wrists stacked above elbows.",
      "Exhale and press weights straight up until arms are fully extended.",
      "Inhale and lower weights back to shoulder level under control."
    ],
    duration: 40,
    caloriesPerMin: 5.5
  },
  {
    id: "db_romanian_deadlift",
    name: "Dumbbell Romanian Deadlift",
    equipment: "dumbbells",
    type: "strength",
    target: "Legs",
    description: "Targets the hamstrings, glutes, and lower back with a hip hinge movement.",
    steps: [
      "Stand with feet hip-width apart, holding dumbbells in front of your thighs.",
      "With a flat back and slight bend in knees, hinge at the hips to lower the weights.",
      "Keep the dumbbells close to your legs, lowering until you feel a hamstring stretch.",
      "Squeeze your glutes and push hips forward to return to standing."
    ],
    duration: 40,
    caloriesPerMin: 6.5
  },

  // BARBELLS
  {
    id: "bb_back_squat",
    name: "Barbell Back Squat",
    equipment: "barbells",
    type: "strength",
    target: "Legs",
    description: "The gold standard of lower body compound exercises.",
    steps: [
      "Set the barbell at upper-chest height on a rack. Step under and rest it across your traps.",
      "Unrack the bar and take two steps back; feet shoulder-width, toes turned slightly out.",
      "Inhale, push your hips back, and bend knees to lower until thighs are parallel to the floor.",
      "Drive back up to standing by pushing through your mid-foot, exhaling."
    ],
    duration: 45,
    caloriesPerMin: 8.5
  },
  {
    id: "bb_deadlift",
    name: "Barbell Conventional Deadlift",
    equipment: "barbells",
    type: "strength",
    target: "Legs",
    description: "Powerful full-body compound movement focusing on posterior chain.",
    steps: [
      "Stand with mid-foot under the barbell, feet hip-width apart.",
      "Hinge forward and grab the bar with a shoulder-width grip, keeping shins touching the bar.",
      "Flatten your back, pull your chest up, and push through your feet to stand.",
      "Keep the bar close to your body as you rise, locking out at the top by squeezing glutes."
    ],
    duration: 45,
    caloriesPerMin: 9.5
  },
  {
    id: "bb_bench_press",
    name: "Barbell Bench Press",
    equipment: "barbells",
    type: "strength",
    target: "Chest",
    description: "Classic chest builder utilizing free-weight pressing power.",
    steps: [
      "Lie flat on the bench, feet flat on the ground, eyes directly under the bar.",
      "Grasp the bar with a grip slightly wider than shoulder-width.",
      "Unrack the bar, lower it slowly to mid-chest while tucking elbows slightly.",
      "Exhale and press the bar straight up to the starting position."
    ],
    duration: 40,
    caloriesPerMin: 7
  },
  {
    id: "bb_bent_row",
    name: "Barbell Bent-Over Row",
    equipment: "barbells",
    type: "strength",
    target: "Back",
    description: "Compound horizontal pull that targets the entire back.",
    steps: [
      "Hold a barbell with a shoulder-width overhand grip, feet hip-width apart.",
      "Hinge at the hips, keeping your back flat and torso nearly parallel to the floor.",
      "Pull the bar to your lower chest, squeezing shoulder blades together.",
      "Lower the bar back to full arm extension under control."
    ],
    duration: 40,
    caloriesPerMin: 7.5
  },

  // KETTLEBELLS
  {
    id: "kb_swing",
    name: "Kettlebell Swing",
    equipment: "kettlebells",
    type: "cardio",
    target: "Full Body",
    description: "Dynamic ballistic movement targeting glutes, hamstrings, and endurance.",
    steps: [
      "Stand with feet shoulder-width apart, kettlebell on the floor in front of you.",
      "Hinge back, grab the handle, and pull it back between your legs to generate momentum.",
      "Snap your hips forward dynamically, swinging the kettlebell up to chest height.",
      "Guide the swing back down between your legs, hinging at the hips, and repeat."
    ],
    duration: 40,
    caloriesPerMin: 9
  },
  {
    id: "kb_goblet_squat",
    name: "Kettlebell Goblet Squat",
    equipment: "kettlebells",
    type: "strength",
    target: "Legs",
    description: "Front-loaded squat that improves mobility and leg strength.",
    steps: [
      "Hold the kettlebell by the horns close to your chest.",
      "Lower down into a squat, keeping your chest upright and knees tracking over toes.",
      "Drive through your heels to return to standing.",
      "Keep core engaged and shoulder blades retracted."
    ],
    duration: 40,
    caloriesPerMin: 7.5
  },
  {
    id: "kb_halo",
    name: "Kettlebell Halo",
    equipment: "kettlebells",
    type: "strength",
    target: "Shoulders",
    description: "Excellent movement for shoulder mobility and core stability.",
    steps: [
      "Hold the kettlebell upside down by the horns in front of your chest.",
      "Move the bell around your head in a circular path, keeping it close to your neck.",
      "Engage your abs to keep your torso perfectly stable.",
      "Alternate clockwise and counter-clockwise rotations."
    ],
    duration: 35,
    caloriesPerMin: 5
  },
  {
    id: "kb_turkish_getup",
    name: "Kettlebell Turkish Get-Up",
    equipment: "kettlebells",
    type: "strength",
    target: "Full Body",
    description: "Highly technical multi-step movement for structural stability.",
    steps: [
      "Lie on the side, grab the kettlebell, roll to your back, and press it straight up.",
      "Bend the knee on the side holding the weight, opposite arm flat to the side.",
      "Roll up onto your elbow, then lift onto your hand.",
      "Bridge your hips, slide your straight leg underneath into a lunge position, and stand up.",
      "Reverse the steps slowly to return to the floor."
    ],
    duration: 60,
    caloriesPerMin: 8
  },

  // ELASTIC BAND
  {
    id: "band_pull_apart",
    name: "Elastic Band Pull-Apart",
    equipment: "elastic-band",
    type: "strength",
    target: "Shoulders",
    description: "Activates the rear deltoids and improves posture.",
    steps: [
      "Stand tall, holding the elastic band in front of your chest with hands shoulder-width apart.",
      "Keep your arms straight or with a micro-bend in elbows.",
      "Pull your hands apart to the sides, stretching the band until it touches your chest.",
      "Slowly return to the start, maintaining tension on the band."
    ],
    duration: 30,
    caloriesPerMin: 4
  },
  {
    id: "band_squat",
    name: "Banded Squats",
    equipment: "elastic-band",
    type: "strength",
    target: "Legs",
    description: "Increases glute activation by placing resistance against outward knee travel.",
    steps: [
      "Place a loop band around your thighs, just above your knees.",
      "Stand with feet shoulder-width apart, pushing out against the band.",
      "Squat down by pushing hips back, ensuring knees do not cave inward.",
      "Drive back up to standing, keeping glutes squeezed."
    ],
    duration: 40,
    caloriesPerMin: 6.5
  },
  {
    id: "band_bicep_curl",
    name: "Banded Bicep Curl",
    equipment: "elastic-band",
    type: "strength",
    target: "Arms",
    description: "Bicep curl with constant tension throughout the range of motion.",
    steps: [
      "Stand on the middle of the band, holding the handles/ends in each hand.",
      "Keep your elbows locked to your ribs, palms facing upward.",
      "Curl your hands toward your shoulders, feeling the tension increase.",
      "Slowly lower back down to full arm extension."
    ],
    duration: 35,
    caloriesPerMin: 4
  },
  {
    id: "band_face_pull",
    name: "Banded Face Pulls",
    equipment: "elastic-band",
    type: "strength",
    target: "Shoulders",
    description: "Builds upper back and rear shoulder stability, excellent for desk workers.",
    steps: [
      "Anchor the band at upper-chest height to a secure post.",
      "Grasp the band with an overhand grip, step back to create tension.",
      "Pull the band toward your nose/ears, pulling your elbows high and wide.",
      "Squeeze your rear shoulders, then slowly let the band pull arms forward."
    ],
    duration: 40,
    caloriesPerMin: 4.5
  },

  // BODYWEIGHT (No Equipment)
  {
    id: "bw_pushup",
    name: "Standard Push-Ups",
    equipment: "none",
    type: "strength",
    target: "Chest",
    description: "Fundamental upper-body push movement targeting chest, shoulders, and triceps.",
    steps: [
      "Start in a high plank position, hands slightly wider than shoulders.",
      "Keep your body in a straight line from head to heels.",
      "Lower your chest to the floor by bending elbows at a 45-degree angle.",
      "Push back up to the start position, exhaling."
    ],
    duration: 40,
    caloriesPerMin: 6.5
  },
  {
    id: "bw_squat",
    name: "Bodyweight Squats",
    equipment: "none",
    type: "strength",
    target: "Legs",
    description: "Excellent bodyweight movement for lower body strength and mobility.",
    steps: [
      "Stand with feet shoulder-width apart, toes pointing slightly outward.",
      "Keep chest up, hinge at hips and bend knees to lower down.",
      "Go as deep as comfortable, ideally thighs parallel to the floor.",
      "Push through the mid-foot to stand back up."
    ],
    duration: 40,
    caloriesPerMin: 6
  },
  {
    id: "bw_plank",
    name: "Forearm Plank",
    equipment: "none",
    type: "strength",
    target: "Core",
    description: "Isometric core holds that build stability and lower back protection.",
    steps: [
      "Place forearms flat on the floor, elbows aligned directly under shoulders.",
      "Extend your legs behind, toes tucked, keeping your body in a straight plank.",
      "Engage your abs, glutes, and quadriceps.",
      "Hold this position, breathing steadily throughout the set."
    ],
    duration: 45,
    caloriesPerMin: 4
  },
  {
    id: "bw_jumping_jacks",
    name: "Jumping Jacks",
    equipment: "none",
    type: "cardio",
    target: "Cardio",
    description: "Full-body aerobic conditioning exercise that elevates heart rate.",
    steps: [
      "Stand with feet together, arms resting naturally at your sides.",
      "Jump your feet out to the sides while raising arms above your head.",
      "Immediately jump back to the starting position and repeat fluidly."
    ],
    duration: 35,
    caloriesPerMin: 8.5
  },
  {
    id: "bw_mountain_climber",
    name: "Mountain Climbers",
    equipment: "none",
    type: "cardio",
    target: "Core",
    description: "Combines high-plank stabilization with rapid knee drives for core and cardio.",
    steps: [
      "Start in a high plank position, wrists aligned below shoulders.",
      "Drive your right knee toward your chest, then return to starting position.",
      "Immediately drive your left knee toward your chest.",
      "Alternate legs quickly, maintaining a flat hip alignment."
    ],
    duration: 35,
    caloriesPerMin: 8
  },
  {
    id: "bw_burpees",
    name: "Burpees",
    equipment: "none",
    type: "cardio",
    target: "Cardio",
    description: "Full-body metabolic conditioning exercise for explosive power.",
    steps: [
      "Stand tall, squat down and place your hands flat on the floor.",
      "Jump feet back into a push-up position, performing a quick push-up.",
      "Jump feet forward to hand positions, and explosively jump straight up.",
      "Land softly and immediately transition into the next repetition."
    ],
    duration: 40,
    caloriesPerMin: 11
  },
  {
    id: "bw_lunge",
    name: "Forward Lunges",
    equipment: "none",
    type: "strength",
    target: "Legs",
    description: "Unilateral leg exercise highlighting balance and hamstring/quad development.",
    steps: [
      "Stand tall with feet hip-width apart.",
      "Take a large step forward with your right foot and bend both knees.",
      "Lower until your back knee is just above the floor, front knee at 90 degrees.",
      "Push off your front foot to return to the starting position. Alternate legs."
    ],
    duration: 40,
    caloriesPerMin: 6
  },
  {
    id: "bw_glute_bridge",
    name: "Glute Bridges",
    equipment: "none",
    type: "strength",
    target: "Legs",
    description: "Isolates glute contraction and opens tight hip flexors.",
    steps: [
      "Lie on your back, knees bent, feet flat on the floor hip-width apart.",
      "Keep arms by your sides. Squeeze glutes and press heels to lift hips upward.",
      "Form a straight line from knees to shoulders at the top.",
      "Slowly lower back down to the floor."
    ],
    duration: 40,
    caloriesPerMin: 5
  },
  {
    id: "bw_russian_twist",
    name: "Russian Twists",
    equipment: "none",
    type: "strength",
    target: "Core",
    description: "Rotational abdominal movement targeting the obliques.",
    steps: [
      "Sit on the floor, bend your knees, and lift your feet slightly (or keep heels on floor).",
      "Lean back at a 45-degree angle, keeping your spine straight.",
      "Clasp hands in front of you and rotate your torso to the right, then to the left.",
      "Move with control, exhaling on each turn."
    ],
    duration: 35,
    caloriesPerMin: 5.5
  },

  // COOLDOWNS (No equipment required for standard cooldown stretches)
  {
    id: "cooldown_childs_pose",
    name: "Child's Pose",
    equipment: "none",
    type: "cooldown",
    target: "Back & Hips",
    description: "Restorative stretch to release tension in lower back, shoulders, and hips.",
    steps: [
      "Kneel on the floor, touch big toes together, and sit back on your heels.",
      "Separate knees about hip-width apart, and lay your torso down between thighs.",
      "Extend your arms forward on the floor, palms down.",
      "Rest your forehead on the floor and breathe deeply."
    ],
    duration: 45,
    caloriesPerMin: 1.5
  },
  {
    id: "cooldown_cobra_stretch",
    name: "Cobra Stretch",
    equipment: "none",
    type: "cooldown",
    target: "Abs & Spine",
    description: "Relieves abdominal tightness and improves spinal flexibility.",
    steps: [
      "Lie face down on the floor, legs extended straight behind.",
      "Place your hands on the floor under your shoulders, elbows tucked in.",
      "Inhale, push through your hands to gently lift your chest off the floor.",
      "Keep your shoulders down and gaze neutral. Hold and breathe."
    ],
    duration: 40,
    caloriesPerMin: 1.8
  },
  {
    id: "cooldown_hamstring_stretch",
    name: "Standing Hamstring Stretch",
    equipment: "none",
    type: "cooldown",
    target: "Legs",
    description: "Safely releases tightness in back of thighs.",
    steps: [
      "Stand tall, extend your right leg forward, heel on the floor, toes pointed up.",
      "Hinge at your hips, keeping your back straight, bending your left knee slightly.",
      "Lean forward, placing hands on your left thigh for support.",
      "Hold the stretch, then switch to the left leg."
    ],
    duration: 40,
    caloriesPerMin: 1.5
  },
  {
    id: "cooldown_quad_stretch",
    name: "Standing Quad Stretch",
    equipment: "none",
    type: "cooldown",
    target: "Legs",
    description: "Stretches front of the thighs and improves balance.",
    steps: [
      "Stand on your left leg. Bend your right knee, bringing your foot toward your glute.",
      "Reach back and grasp your right foot or ankle with your right hand.",
      "Keep your knees close together and stand tall, pushing your hips slightly forward.",
      "Hold for half the duration, then switch legs."
    ],
    duration: 40,
    caloriesPerMin: 1.5
  }
];
