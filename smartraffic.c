#include <stdio.h>
#define MAX 20
struct Queue {
 int items[MAX];
 int front, rear, count;
};
void initQueue(struct Queue *q) {
    q->front = 0;
    q->rear = -1;
    q->count = 0;
    }
int isEmpty(struct Queue *q) {
    return q->count == 0;
}
void enqueue(struct Queue *q, int vehicle) {
    if (q->count == MAX)
    return;
    q->rear = (q->rear + 1) % MAX;
    q->items[q->rear] = vehicle;
    q->count++;
    }
void dequeue(struct Queue *q) {
    if (isEmpty(q))
    return;
    q->front = (q->front + 1) % MAX;
    q->count--;
}
int main() {
    struct Queue north, south, east, west;
    initQueue(&north);
    initQueue(&south);
    initQueue(&east);
    initQueue(&west);
    int choice, vehicles, i;
    while (1) {
        printf("\n--- SMART TRAFFIC SIGNAL CONTROLLER ---\n");
        printf("1. Add vehicles\n");
        printf("2. Show vehicle count\n");
        printf("3. Process traffic signal\n");
        printf("4. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);
        switch (choice) {
            case 1:
            printf("Enter vehicles for North: ");
            scanf("%d", &vehicles);
            for (i = 0; i < vehicles; i++) enqueue(&north, 1);
            printf("Enter vehicles for South: ");
            scanf("%d", &vehicles);
            for (i = 0; i < vehicles; i++) enqueue(&south, 1);
            printf("Enter vehicles for East: ");
            scanf("%d", &vehicles);
            for (i = 0; i < vehicles; i++) enqueue(&east, 1);
            printf("Enter vehicles for West: ");
            scanf("%d", &vehicles);
            for (i = 0; i < vehicles; i++) enqueue(&west, 1);
            break;
            case 2:
            printf("\nVehicle Count:\n");
            printf("North: %d\n", north.count);
            printf("South: %d\n", south.count);
            printf("East: %d\n", east.count);
            printf("West: %d\n", west.count);
            break;
            case 3: {
            struct Queue *maxQ = &north;
            char *dir = "North";
            if (south.count > maxQ->count) { maxQ = &south; dir = "South"; }
            if (east.count > maxQ->count) { maxQ = &east; dir = "East"; }
            if (west.count > maxQ->count) { maxQ = &west; dir = "West"; }
            if (maxQ->count == 0) {
            printf("No vehicles at any signal.\n");
            break;
            }
            int greenTime = 5 + maxQ->count;
            printf("\nGREEN SIGNAL: %s\n", dir);
            printf("Green Time: %d seconds\n", greenTime);
            int pass = (maxQ->count > 5) ? 5 : maxQ->count;
            for (i = 0; i < pass; i++)
            dequeue(maxQ);
            printf("%d vehicles passed from %s\n", pass, dir);
            break;
            }
            case 4:
            printf("Simulation Ended.\n");
            return 0;
            default:
            printf("Invalid choice!\n");
        }
    }
}
