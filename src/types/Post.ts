export interface Comment {
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
}

export type Volunteer = {
    userId: string;
    userName: string;
    signupDate: string;
}

export type Post = {
    id: string;
    title: string;
    post_content: string;
    eventDate: string;
    eventTime: string;
    location: string;
    volunteersNeeded: number;
    requiredSkills: string[];
    volunteers: Volunteer[];
    comments: Comment[];
};