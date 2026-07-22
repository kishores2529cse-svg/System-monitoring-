import type { CandidateCardData, ProblemData, MonitoringEvent, LeaderboardEntry, SystemLog, AdminStats } from '../types';

export const INITIAL_CANDIDATES: CandidateCardData[] = [
  {
    id: 'USR001',
    name: 'Vijay Rathinam',
    email: 'vijay@shakthi.edu',
    college: 'Sri Shakthi Institute of Engineering and Technology',
    department: 'Computer Science & Engineering',
    problem: 'Two Sum',
    language: 'Go',
    timeLeft: '01:12:45',
    confidenceScore: 94,
    status: 'Active',
    warnings: 1,
    camera: true,
    microphone: true,
    fullscreen: true,
    tabFocused: true,
    voiceDetected: false,
    startedAt: '12:00:00',
    codeSnippet: `package main

import "fmt"

func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, found := m[diff]; found {
            return []int{idx, i}
        }
        m[num] = i
    }
    return nil
}`
  },
  {
    id: 'USR002',
    name: 'Ananya Sharma',
    email: 'ananya@iitb.ac.in',
    college: 'Indian Institute of Technology Bombay',
    department: 'Information Technology',
    problem: 'LRU Cache',
    language: 'Python',
    timeLeft: '00:45:12',
    confidenceScore: 98,
    status: 'Active',
    warnings: 0,
    camera: true,
    microphone: true,
    fullscreen: true,
    tabFocused: true,
    voiceDetected: false,
    startedAt: '12:05:00',
    codeSnippet: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}`
  },
  {
    id: 'USR003',
    name: 'David Chen',
    email: 'david.chen@mit.edu',
    college: 'Massachusetts Institute of Technology',
    department: 'Electrical Engineering & CS',
    problem: 'Two Sum',
    language: 'Go',
    timeLeft: '00:22:10',
    confidenceScore: 58,
    status: 'Warning',
    warnings: 2,
    camera: true,
    microphone: false,
    fullscreen: false,
    tabFocused: false,
    voiceDetected: true,
    startedAt: '12:10:00',
    codeSnippet: `package main
// Debugging second approach`
  },
  {
    id: 'USR004',
    name: 'Marcus Vance',
    email: 'm.vance@stanford.edu',
    college: 'Stanford University',
    department: 'Artificial Intelligence Lab',
    problem: 'Binary Tree Level Order',
    language: 'C++',
    timeLeft: '00:00:00',
    confidenceScore: 32,
    status: 'Locked',
    warnings: 3,
    camera: false,
    microphone: true,
    fullscreen: false,
    tabFocused: false,
    voiceDetected: true,
    startedAt: '11:45:00',
    codeSnippet: `// Suspicious multiple monitor blur detected`
  },
  {
    id: 'USR005',
    name: 'Priya Patel',
    email: 'ppatel@nitt.edu',
    college: 'National Institute of Technology Trichy',
    department: 'Computer Applications',
    problem: 'Merge Intervals',
    language: 'Go',
    timeLeft: '01:05:30',
    confidenceScore: 89,
    status: 'Active',
    warnings: 1,
    camera: true,
    microphone: true,
    fullscreen: true,
    tabFocused: true,
    voiceDetected: false,
    startedAt: '12:02:00',
    codeSnippet: `package main

import "sort"

func merge(intervals [][]int) [][]int {
    if len(intervals) <= 1 {
        return intervals
    }
    return nil
}`
  },
  {
    id: 'USR006',
    name: 'Alexander Wright',
    email: 'alex@oxford.ac.uk',
    college: 'University of Oxford',
    department: 'Software Engineering',
    problem: 'LRU Cache',
    language: 'JavaScript',
    timeLeft: '00:58:20',
    confidenceScore: 92,
    status: 'Active',
    warnings: 0,
    camera: true,
    microphone: true,
    fullscreen: true,
    tabFocused: true,
    voiceDetected: false,
    startedAt: '12:04:00'
  }
];

export const INITIAL_PROBLEMS: ProblemData[] = [
  {
    id: 101,
    title: 'Two Sum',
    difficulty: 'Easy',
    points: 100,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    starterCode: {
      go: `package main

import "fmt"

// twoSum returns indices of two numbers that sum up to target
func twoSum(nums []int, target int) []int {
    // Write your Go code here
    m := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, found := m[diff]; found {
            return []int{idx, i}
        }
        m[num] = i
    }
    return []int{}
}

func main() {
    nums := []int{2, 7, 11, 15}
    target := 9
    fmt.Println(twoSum(nums, target))
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> m;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (m.count(diff)) return {m[diff], i};
            m[nums[i]] = i;
        }
        return {};
    }
};`
    }
  },
  {
    id: 102,
    title: 'LRU Cache Design',
    difficulty: 'Medium',
    points: 250,
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the key if present, or insert key-value pair.`,
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]'
      }
    ],
    starterCode: {
      go: `package main

type LRUCache struct {
    capacity int
}

func Constructor(capacity int) LRUCache {
    return LRUCache{capacity: capacity}
}

func (this *LRUCache) Get(key int) int {
    return -1
}

func (this *LRUCache) Put(key int, value int) {
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        pass
    def get(self, key: int) -> int:
        return -1
    def put(self, key: int, value: int) -> None:
        pass`,
      javascript: `class LRUCache {
    constructor(capacity) {}
    get(key) { return -1; }
    put(key, value) {}
}`,
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) {}
    int get(int key) { return -1; }
    void put(int key, int value) {}
};`
    }
  }
];

export const INITIAL_MONITORING_EVENTS: MonitoringEvent[] = [
  {
    id: 'EVT-1001',
    candidateId: 'USR001',
    candidateName: 'Vijay Rathinam',
    timestamp: '12:10:23',
    event: 'Tab Switch Detected',
    severity: 'Medium',
    confidenceImpact: -6,
    status: 'Flagged',
    details: 'Browser focus moved away from exam viewport for 3.2 seconds.'
  },
  {
    id: 'EVT-1002',
    candidateId: 'USR001',
    candidateName: 'Vijay Rathinam',
    timestamp: '12:15:40',
    event: 'Right Click Attempted',
    severity: 'Low',
    confidenceImpact: -2,
    status: 'Dismissed',
    details: 'Context menu invocation blocked on Monaco Editor lines 12-14.'
  },
  {
    id: 'EVT-1003',
    candidateId: 'USR003',
    candidateName: 'David Chen',
    timestamp: '12:18:05',
    event: 'Developer Tools Keyboard Shortcut',
    severity: 'High',
    confidenceImpact: -15,
    status: 'Flagged',
    details: 'Pressed Ctrl+Shift+I (Inspect Element attempt).'
  },
  {
    id: 'EVT-1004',
    candidateId: 'USR004',
    candidateName: 'Marcus Vance',
    timestamp: '12:22:11',
    event: 'Fullscreen Exit & Secondary Display Active',
    severity: 'Critical',
    confidenceImpact: -30,
    status: 'Flagged',
    details: 'Multiple screen boundary crossing detected. Automated session lockdown triggered.'
  },
  {
    id: 'EVT-1005',
    candidateId: 'USR003',
    candidateName: 'David Chen',
    timestamp: '12:25:50',
    event: 'Secondary Voice Audio Level Exceeded',
    severity: 'High',
    confidenceImpact: -12,
    status: 'Flagged',
    details: 'Microphone recorded human speech matching external whispering profile.'
  },
  {
    id: 'EVT-1006',
    candidateId: 'USR001',
    candidateName: 'Vijay Rathinam',
    timestamp: '12:30:00',
    event: 'Face Mesh Alignment Re-verified',
    severity: 'Low',
    confidenceImpact: +2,
    status: 'Reviewed',
    details: 'AI verified single face pose within primary eye line vector.'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'USR001',
    name: 'Vijay Rathinam',
    college: 'Sri Shakthi Institute of Engineering and Technology',
    score: 980,
    solved: 5,
    accuracy: '100%',
    time: '34m',
    badge: 'Gold'
  },
  {
    rank: 2,
    id: 'USR002',
    name: 'Ananya Sharma',
    college: 'Indian Institute of Technology Bombay',
    score: 945,
    solved: 5,
    accuracy: '96%',
    time: '38m',
    badge: 'Silver'
  },
  {
    rank: 3,
    id: 'USR006',
    name: 'Alexander Wright',
    college: 'University of Oxford',
    score: 890,
    solved: 4,
    accuracy: '92%',
    time: '41m',
    badge: 'Bronze'
  },
  {
    rank: 4,
    id: 'USR005',
    name: 'Priya Patel',
    college: 'National Institute of Technology Trichy',
    score: 820,
    solved: 4,
    accuracy: '88%',
    time: '45m',
    badge: 'Top Performer'
  },
  {
    rank: 5,
    id: 'USR007',
    name: 'Kevin Zhao',
    college: 'Carnegie Mellon University',
    score: 790,
    solved: 3,
    accuracy: '85%',
    time: '48m'
  }
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  {
    id: 'LOG-8801',
    timestamp: '2026-07-22 12:35:10',
    actor: 'AI Proctor System',
    action: 'CONFIDENCE_SCORE_ADJUST',
    target: 'Candidate USR001',
    severity: 'Low',
    ipAddress: '192.168.1.104',
    details: 'Recalculated baseline AI confidence score from 92% to 94% after clean face mesh return.'
  },
  {
    id: 'LOG-8802',
    timestamp: '2026-07-22 12:30:45',
    actor: 'Admin System',
    action: 'USER_LOCKOUT_TRIGGERED',
    target: 'Candidate USR004',
    severity: 'Critical',
    ipAddress: '10.0.4.12',
    details: 'Automated lockout policy enforced due to 3 consecutive high-severity security breaches.'
  },
  {
    id: 'LOG-8803',
    timestamp: '2026-07-22 12:28:00',
    actor: 'Compiler Microservice',
    action: 'CODE_RUN_EXECUTE',
    target: 'Problem #101 (Go)',
    severity: 'Low',
    ipAddress: '172.16.0.45',
    details: 'Compiled candidate USR001 Go program in 14ms with 0 errors.'
  },
  {
    id: 'LOG-8804',
    timestamp: '2026-07-22 12:20:15',
    actor: 'Safe Exam Browser API',
    action: 'FULLSCREEN_EXIT_ALERT',
    target: 'Candidate USR003',
    severity: 'High',
    ipAddress: '192.168.1.112',
    details: 'Viewport resized below mandated exam boundaries (Width: 1024px vs Min: 1920px).'
  }
];

export const INITIAL_ADMIN_STATS: AdminStats = {
  totalCandidates: 124,
  liveCandidates: 48,
  lockedUsers: 3,
  suspiciousEvents: 18,
  averageConfidenceScore: 92.4,
  completedExams: 73,
  runningExams: 48,
  aiAccuracy: 99.2
};
