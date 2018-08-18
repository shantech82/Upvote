export interface ILiveStream {
    id: number;
    icosid: number;
    livestreamdate: any;
    time: string;
    livestreamcode: string;
    livestreamstatus: string;
}

export interface ISchedules {
    id: number;
    livestreamdatetime: string;
}

export interface IAddSchedules {
    day: number;
    month: number;
    time: number;
}
