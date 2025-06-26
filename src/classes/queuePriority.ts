export type typePriority = 0 | 1 | 2 | 3 | 4

export abstract class QueuePriority<T> {
    public nextItem: T | undefined = undefined;
    protected readonly immediateQueue: T[] = [];
    protected readonly orangeQueue: T[] = [];
    protected readonly yellowQueue: T[] = [];
    protected readonly greenQueue: T[] = [];
    protected readonly blueQueue: T[] = [];
    protected readonly geralQueue = [
        this.immediateQueue,
        this.orangeQueue, 
        this.yellowQueue, 
        this.greenQueue, 
        this.blueQueue
    ];

    protected enqueue(item: T, priority: typePriority): void {
        this.geralQueue[priority].push(item);
    }

    protected dequeue() :void {
        for(const queue of this.geralQueue) {
            if(queue.length > 0) {
                this.nextItem = queue.shift();
                return;
            };
        }
        this.nextItem = undefined;
    }
}