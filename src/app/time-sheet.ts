export class TimeSheet {

    date: Date;
    effortLogs: Array<EffortLog>;
}

export class EffortLog {

    taskName: string;
    taskId: number;
    effortInHrs: number;
}

export class Task {

    id: number;
    name: string;
    description: string;
}
