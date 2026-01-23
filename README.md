# Smart-Traffic-Signal
Queue-based intelligent traffic signal controller system with priority scheduling algorithm
# Smart Traffic Signal Controller System

An intelligent traffic signal management system using circular queue data structures to dynamically optimize traffic flow at four-way intersections based on real-time vehicle density.

## 🚦 Overview
This project implements a smart traffic controller that prioritizes traffic signals based on vehicle count, allocating green light duration proportionally to reduce congestion and minimize waiting time.

## ✨ Features
- **Dynamic Priority Scheduling:** Direction with highest vehicle count gets priority
- **Adaptive Timing:** Green time = 5 + vehicle count (in seconds)
- **Circular Queue Implementation:** Efficient O(1) enqueue/dequeue operations
- **Real-time Monitoring:** Track vehicle counts across all four directions
- **Throughput Control:** Maximum 5 vehicles per cycle to prevent monopolization

## 🛠️ Technology Stack
- **Language:** C
- **Data Structure:** Circular Queue (Ring Buffer)
- **Algorithm:** Priority-based Greedy Scheduling
- **Capacity:** 20 vehicles per direction

## 📋 How It Works

### System Architecture
The system maintains four independent circular queues representing traffic from:
- North
- South  
- East
- West

### Algorithm
1. Compare vehicle counts across all directions
2. Select direction with maximum vehicles (priority queue)
3. Calculate green time: `5 + number of vehicles`
4. Process up to 5 vehicles from the priority queue
5. Repeat cycle

### Example
```
Input: North=10, South=2, East=3, West=1
Output: North gets priority
Green Time: 15 seconds
Vehicles Passed: 5
Remaining: 5 vehicles in North queue
```

## 🚀 Installation & Usage

### Compilation
```bash
gcc traffic_signal.c -o traffic_signal
```

### Execution
```bash
./traffic_signal
```

### Menu Options
1. **Add vehicles** - Input vehicle count for each direction
2. **Show vehicle count** - Display current queue status
3. **Process traffic signal** - Execute one signal cycle
4. **Exit** - End simulation

## 📊 Performance Analysis

**Time Complexity:**
- Vehicle Addition: O(n) where n = number of vehicles
- Signal Processing: O(1)
- Status Display: O(1)

**Space Complexity:** O(80) - constant space for 4 queues × 20 capacity

**Efficiency Gain:** 30-40% theoretical improvement over fixed-time systems

## 📄 Documentation
For detailed technical documentation, see [Technical Report](Smart_Traffic_Signal_final.pdf)

The report includes:
- System architecture and design
- Mathematical models and complexity analysis
- Implementation details
- Testing results and scenarios
- Future research directions

## 🔮 Future Enhancements
- Machine learning integration for traffic pattern prediction
- Multi-intersection coordination for green wave effect
- Real-time sensor/camera integration
- GUI with traffic flow visualization
- Vehicle-to-Infrastructure (V2I) communication
- Emergency vehicle preemption

## 👨‍💻 Author
**Krish Ramesh Pareet**  
B.E. Computer Science and Business Systems  
B.M.S. College of Engineering

- 📧 Email: krishrpareet@gmail.com
- 💼 LinkedIn: [krish-pareet](https://www.linkedin.com/in/krish-pareet-3b949031b/)
- 🐙 GitHub: [@krishrp1](https://github.com/krishrp1)

## 📝 License
MIT License - feel free to use this project for learning and development

## 🙏 Acknowledgments
Course: Data Structures and Applications  
Institution: B.M.S. College of Engineering  
Semester: 2024-2025
```

