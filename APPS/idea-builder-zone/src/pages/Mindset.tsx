import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, Zap, BookOpen, CheckCircle2, Smile, Meh, Frown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const Mindset = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("visualization");
  const [stateOfMind, setStateOfMind] = useState<string>("");
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [journalEntries, setJournalEntries] = useState({
    learned: "",
    feeling: "",
    intention: ""
  });
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    loadMindsetData();
  }, []);

  const loadMindsetData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load today's mindset entries
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from("mindset_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today)
      .order("created_at", { ascending: false }) as any;

    if (data && data.length > 0) {
      const latest = data[0] as any;
      setStateOfMind(latest.state_of_mind || "");
      setCompletedExercises(latest.completed_exercises || []);
    }
  };

  const handleSaveStateOfMind = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your state of mind",
        variant: "destructive",
      });
      return;
    }

    const { error } = await (supabase.from("mindset_entries") as any).upsert({
      user_id: user.id,
      state_of_mind: stateOfMind,
      completed_exercises: completedExercises,
      created_at: new Date().toISOString(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save state of mind",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved!",
        description: "Your state of mind has been recorded",
      });
    }
  };

  const handleMarkComplete = async (exerciseName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track exercises",
        variant: "destructive",
      });
      return;
    }

    const updated = [...completedExercises, exerciseName];
    setCompletedExercises(updated);

    const { error } = await (supabase.from("mindset_entries") as any).upsert({
      user_id: user.id,
      state_of_mind: stateOfMind,
      completed_exercises: updated,
      created_at: new Date().toISOString(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as complete",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Great Job! 🎉",
        description: `${exerciseName} completed`,
      });
    }
  };

  const handleSaveJournal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save journal entries",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingAI(true);
    
    // Get AI motivational response
    try {
      const fullEntry = `What I learned: ${journalEntries.learned}\nHow I'm feeling: ${journalEntries.feeling}\nMy intention: ${journalEntries.intention}`;
      
      const { data: aiData, error: aiError } = await supabase.functions.invoke('mindset-coach', {
        body: { journalEntry: fullEntry }
      });

      if (aiError) throw aiError;

      setAiResponse(aiData.motivationalMessage);

      // Save journal with AI response
      const { error } = await (supabase.from("mindset_entries") as any).upsert({
        user_id: user.id,
        state_of_mind: stateOfMind,
        completed_exercises: completedExercises,
        journal_entry: JSON.stringify({
          ...journalEntries,
          ai_response: aiData.motivationalMessage
        }),
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Journal Saved!",
        description: "Check out your personalized coaching below",
      });
      
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save journal",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const isCompleted = (exercise: string) => completedExercises.includes(exercise);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          Mindset Training
        </h1>
        <p className="text-muted-foreground">Mental fitness and performance psychology</p>
      </div>

      {/* State of Mind Selector */}
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>Track your mental state before training</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              variant={stateOfMind === "positive" ? "default" : "outline"}
              className="flex-1 h-20 flex-col gap-2"
              onClick={() => setStateOfMind("positive")}
            >
              <Smile className="h-6 w-6" />
              Positive
            </Button>
            <Button
              variant={stateOfMind === "neutral" ? "default" : "outline"}
              className="flex-1 h-20 flex-col gap-2"
              onClick={() => setStateOfMind("neutral")}
            >
              <Meh className="h-6 w-6" />
              Neutral
            </Button>
            <Button
              variant={stateOfMind === "negative" ? "default" : "outline"}
              className="flex-1 h-20 flex-col gap-2"
              onClick={() => setStateOfMind("negative")}
            >
              <Frown className="h-6 w-6" />
              Struggling
            </Button>
          </div>
          {stateOfMind && (
            <Button onClick={handleSaveStateOfMind} className="w-full">
              Save State of Mind
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Mental Exercises Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Mental Training Exercises</CardTitle>
          <CardDescription>Complete daily exercises to strengthen your mental game</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Visualization
                {isCompleted("Pre-Race Visualization") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </TabsTrigger>
              <TabsTrigger value="breathing" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Breathing
                {isCompleted("Focus & Breathing") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Journal
                {isCompleted("Performance Journal") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </TabsTrigger>
            </TabsList>

            {/* Pre-Race Visualization */}
            <TabsContent value="visualization" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pre-Race Visualization</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch this guided visualization and follow along to mentally prepare for your race
                  </p>
                </div>

                {/* Video Embed */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/jVJBw0BWrPY"
                    title="Sailing Pre-Race Visualization"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Instructions */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-base">Exercise Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">1</Badge>
                      <p className="text-sm">Find a quiet space where you won&apos;t be disturbed for 5 minutes</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">2</Badge>
                      <p className="text-sm">Close your eyes and visualize your perfect race start</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">3</Badge>
                      <p className="text-sm">See yourself making smart tactical decisions and sailing fast</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">4</Badge>
                      <p className="text-sm">Feel the confidence and calmness in your body</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">5</Badge>
                      <p className="text-sm">End by visualizing crossing the finish line successfully</p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={() => handleMarkComplete("Pre-Race Visualization")}
                  disabled={isCompleted("Pre-Race Visualization")}
                  className="w-full"
                  size="lg"
                >
                  {isCompleted("Pre-Race Visualization") ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Focus & Breathing */}
            <TabsContent value="breathing" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Box Breathing Exercise</h3>
                  <p className="text-muted-foreground mb-4">
                    Practice controlled breathing to improve focus and reduce pre-race anxiety
                  </p>
                </div>

                {/* Video Embed */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/tEmt1Znux58"
                    title="Box Breathing Exercise"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Instructions */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-base">Exercise Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">1</Badge>
                      <p className="text-sm">Breathe in slowly through your nose for 4 counts</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">2</Badge>
                      <p className="text-sm">Hold your breath for 4 counts</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">3</Badge>
                      <p className="text-sm">Exhale slowly through your mouth for 4 counts</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">4</Badge>
                      <p className="text-sm">Hold empty for 4 counts</p>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">5</Badge>
                      <p className="text-sm">Repeat 5-10 times until you feel centered and calm</p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={() => handleMarkComplete("Focus & Breathing")}
                  disabled={isCompleted("Focus & Breathing")}
                  className="w-full"
                  size="lg"
                >
                  {isCompleted("Focus & Breathing") ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Performance Journal */}
            <TabsContent value="journal" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Performance Journal</h3>
                  <p className="text-muted-foreground mb-4">
                    Reflect on your training and set intentions for tomorrow
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">What did you learn from today&apos;s workout?</label>
                    <Textarea
                      value={journalEntries.learned}
                      onChange={(e) => setJournalEntries({ ...journalEntries, learned: e.target.value })}
                      placeholder="Today I learned that..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">How are you feeling mentally about your sailing preparation?</label>
                    <Textarea
                      value={journalEntries.feeling}
                      onChange={(e) => setJournalEntries({ ...journalEntries, feeling: e.target.value })}
                      placeholder="I feel..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">What&apos;s your intention for tomorrow&apos;s training?</label>
                    <Textarea
                      value={journalEntries.intention}
                      onChange={(e) => setJournalEntries({ ...journalEntries, intention: e.target.value })}
                      placeholder="Tomorrow I will focus on..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveJournal}
                  className="w-full"
                  size="lg"
                  disabled={isLoadingAI || !journalEntries.learned || !journalEntries.feeling || !journalEntries.intention}
                >
                  {isLoadingAI ? "Getting AI Coaching..." : "Save & Get AI Coaching"}
                </Button>

                {/* AI Response */}
                {aiResponse && (
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Your Mindset Coach Says:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">{aiResponse}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Mental Tips */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle>Today&apos;s Mental Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">&quot;The race is won in the mind first.&quot;</span>
            <br /><br />
            Mental preparation is just as important as physical training. Take time each day to visualize your performance, practice controlled breathing during high-pressure moments, and maintain a positive internal dialogue. Champions master their mindset before they master the course.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mindset;
