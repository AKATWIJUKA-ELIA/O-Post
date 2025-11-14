"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useNotification } from "../../NotificationContext";
import { getSubscribers, createNewsletter, updateNewsletter, getNewsLetters } from "@/lib/convex";
import { useSendMail } from "@/hooks/useSendMail";
import NewsletterEmail from "@/EmailTemplates/Newsletter";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {deleteNewsletter} from "@/lib/convex";
import { Label } from "@/components/ui/label";

const NewsletterAdminPage = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [scheduling, setScheduling] = useState<boolean>(false);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const { setNotification } = useNotification();
  const { sendEmail } = useSendMail();

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );
  const subscribersQuery = useQuery(api.NewsLetter.getSubscribers);
  const newsLettersQuery = useQuery(api.NewsLetter.getNewsLetters);
//   console.log("newsLettersQuery", newsLettersQuery)


  const resetForm = () => {
    setSubject("");
    setContent("");
  };
 const handleDelete = async (id: Id<"NewsLetterStorage">) => {
        setLoadingList(true);
        await deleteNewsletter(id).then((res) => {
                if(!res.success){
                        setNotification({ status: "info", message: res.message || "Failed to delete newsletter." });
                }
                setNotification({ status: "success", message: "Newsletter deleted successfully." });
        });
        setLoadingList(false);
 };
  const handleSchedule = async () => {
    if (!subject.trim() || !content.trim()) {
      setNotification({ status: "info", message: "Please provide subject and content." });
      return;
    }
    
    setSaving(true);
    const emails = subscribersQuery?.map((s) => s.email) || [];
    const res = await createNewsletter({
      title:subject,
      content,
      recipients: emails,
      status: "pending",
      scheduledTime: new Date(scheduledTime).getTime(),
    });
    setSaving(false);
    if (!res.success) {
      setNotification({ status: "info", message: res.message || "Failed to save draft." });
      setScheduling(false);
      return;
    }
    setNotification({ status: "success", message: "Newsletter saved as draft." });
    setScheduling(false);
        resetForm();
        setScheduledTime("");
  };

  const handleSendNow = async () => {
    if (!subject.trim() || !content.trim()) {
      setNotification({ status: "info", message: "Please provide subject and content." });
      return;
    }
    if (subscribersQuery?.length === 0) {
      setNotification({ status: "info", message: "No subscribers to send to." });
      return;
    }
    setSending(true);
    const emails = subscribersQuery?.map((s) => s.email)|| [];

    // Create a record first as pending
try{    await createNewsletter({
      title: subject,
      content,
      recipients: emails,
      status: "pending",
      scheduledTime: Date.now(),
    }).then(async (created) => {
        if (!created.success) {
                setNotification({ status: "info", message: created.message || "Failed to create newsletter record." });
        }
            const html = NewsletterEmail(subject, content, {
      siteName: "O-Post",
      unsubscribeUrl: `${origin}/profile`,
    });

    const Sent = emails.map(async (email) => await sendEmail(email, subject, html));
        await updateNewsletter({
        _id: created.id as any,
        content: content,
        status:  "sent",
        DateSent: Date.now(),
      });
        const results = await Promise.allSettled(Sent);
         resetForm();
         setSending(false);
         setNotification({ status: "success", message: "Newsletter sent to all subscribers." });
         
        return results;

    });
}catch{
        setSending(false);
        setNotification({ status: "info", message: "Failed to send newsletter." });
        resetForm();
}
  };


  type NewsletterRecord = {
    _id: Id<"NewsLetterStorage">;
    title: string;
    content: string;
    status: "pending" | "sent" | "scheduled" | "failed" | "bounced";
    scheduledTime: number;
    DateSent?: number;
    receipients: string[];
    _creationTime?: number;
  };

  const handleEditDraft = (rec: NewsletterRecord) => {
    setSubject(rec.title);
    setContent(rec.content);
    setNotification({ status: "success", message: "Draft loaded into editor." });
  };



  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Newsletter</h1>
        <div className="text-sm text-muted-foreground">
          Subscribers: {loadingSubs ? "Loading..." : subscribersQuery?.length}
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Create Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Input
              placeholder="Write an engaging subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-2xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              placeholder="Write your newsletter content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full rounded-2xl border bg-background p-3 text-sm focus:outline-none"
            />
            <p className="mt-2 text-xs text-muted-foreground">Basic formatting supported. Line breaks will be preserved.</p>
          </div>
          {scheduling && <div >
                          <Label htmlFor="scheduledTime">Schedule Time</Label>
                         <Input
                         id="scheduledTime"
                        type="datetime-local"
                        required
                        min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                        value={scheduledTime
                        ? new Date(new Date(scheduledTime).getTime() - new Date(scheduledTime).getTimezoneOffset() * 60000)
                                .toISOString().slice(0, 16)
                        : ""
                        }
                        onChange={(e) => {
                        if (!e.target.value) { setScheduledTime(new Date().toISOString().slice(0, 16));
                        return;
                        }
                        
                        // Create date in local timezone
                        const localDate = new Date(e.target.value);
                        
                        // Check if it's in the future
                        if (localDate < new Date()) {
                        setNotification({
                        status: "error",
                        message: "Scheduled time must be in the future",
                })
                setScheduledTime("");
                        return;
                        }
                        
                        setScheduledTime(localDate.toISOString());
                        }}
                        className="mt-1"
                        />
                        </div>}

        </CardContent>
        <CardFooter className="flex items-center gap-2">
                <Button onClick={handleSendNow} disabled={sending || saving||scheduling} className="rounded-2xl bg-blue hover:bg-blue/90">
            {sending ? "Sending..." : "Send Now"}
          </Button> 

          {!scheduling && <Button onClick={() => setScheduling(true)} disabled={saving || sending} className="rounded-2xl bg-gray-600 text-white hover:bg-gray-700">
            {"Schedule"}
          </Button>}
          {scheduling &&<>
          
           <Button onClick={() => setScheduling(false)} disabled={saving || sending} className="rounded-2xl bg-red-600 text-white hover:bg-red-700">
            {"Cancel"}
          </Button>
          <Button onClick={handleSchedule} disabled={saving || sending||scheduledTime.length<1} className="rounded-2xl bg-gray-600 text-white hover:bg-gray-700">
            {saving ? "Saving..." : "Submit"}
          </Button>
          </>
          }
          
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Newsletters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>{loadingList ? "Loading…" : newsLettersQuery?.length === 0 ? "No newsletters yet." : undefined}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>    
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead className="text-right">Recipients</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsLettersQuery?.map((n) => (
                <TableRow key={String(n._id)}>
                  <TableCell className="font-medium max-w-[320px] truncate">{n.title}</TableCell>
                  <TableCell className="capitalize">{n.status}</TableCell>
                  <TableCell>{formatDate(n.scheduledTime || 0)}</TableCell>
                  <TableCell>{n.DateSent ? formatDate(n.DateSent) : "—"}</TableCell>
                  <TableCell className="text-right">{n.receipients?.length ?? 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" className="rounded-2xl" onClick={() => handleEditDraft(n)}>Edit</Button>
                    <Button className="rounded-2xl bg-red hover:bg-red/90" onClick={() => handleDelete(n._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterAdminPage;