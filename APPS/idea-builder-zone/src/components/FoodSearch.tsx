import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Camera, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FoodItem {
  fdcId: number;
  description: string;
  brandName?: string;
  dataType: string;
  foodNutrients: Array<{
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

interface FoodSearchProps {
  onSelectFood: (food: {
    meal_name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }) => void;
}

export const FoodSearch = ({ onSelectFood }: FoodSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionSize, setPortionSize] = useState(100);
  const { toast } = useToast();

  const searchFood = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSelectedFood(null);
    try {
      const apiKey = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY';
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchQuery)}&pageSize=20&api_key=${apiKey}`
      );
      
      if (!response.ok) throw new Error("Failed to search food database");
      
      const data = await response.json();
      setResults(data.foods || []);
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: "Unable to search food database. Please try manual entry.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const { data, error } = await supabase.functions.invoke("analyze-food-image", {
          body: { image: base64Image },
        });

        if (error) throw error;

        if (data?.success && data.nutritionData) {
          toast({
            title: "Image analyzed!",
            description: "Nutritional information extracted from image",
          });
          
          onSelectFood(data.nutritionData);
        } else {
          throw new Error("Could not analyze image");
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message || "Unable to analyze food image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setSelectedImage(null);
    }
  };

  const extractNutrients = (food: FoodItem) => {
    const nutrients = food.foodNutrients;
    
    const getNutrient = (name: string, alternativeNames: string[] = []) => {
      const names = [name.toLowerCase(), ...alternativeNames.map(n => n.toLowerCase())];
      const nutrient = nutrients.find(n => names.includes(n.nutrientName.toLowerCase()));
      return nutrient?.value || 0;
    };

    return {
      meal_name: `${food.brandName ? food.brandName + " - " : ""}${food.description}`,
      calories: getNutrient("Energy", ["energy", "calories"]),
      protein_g: getNutrient("Protein"),
      carbs_g: getNutrient("Carbohydrate, by difference", ["Carbohydrate"]),
      fat_g: getNutrient("Total lipid (fat)", ["fat"]),
    };
  };

  const handleAddFoodWithPortion = () => {
    if (!selectedFood) return;

    const originalNutrients = extractNutrients(selectedFood);
    const ratio = portionSize / 100;

    const adjustedNutrients = {
      meal_name: originalNutrients.meal_name,
      calories: originalNutrients.calories * ratio,
      protein_g: originalNutrients.protein_g * ratio,
      carbs_g: originalNutrients.carbs_g * ratio,
      fat_g: originalNutrients.fat_g * ratio,
    };

    onSelectFood(adjustedNutrients);

    // Reset state
    setSelectedFood(null);
    setPortionSize(100);
    setResults([]);
    setSearchQuery("");

    toast({
      title: "Food added",
      description: `${portionSize}g of ${adjustedNutrients.meal_name} added to your diary.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for food (e.g., chicken breast, apple)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchFood()}
            className="pl-9"
          />
        </div>
        <Button onClick={searchFood} disabled={isSearching}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="food-image-upload"
            disabled={isAnalyzing}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("food-image-upload")?.click()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Scan Food
              </>
            )}
          </Button>
        </div>
      </div>

      {selectedFood ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Adjust Portion</CardTitle>
                <CardDescription>{extractNutrients(selectedFood).meal_name}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFood(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Nutritional values below are for a 100g serving. Adjust the portion size as needed.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="portion" className="text-sm font-medium">Portion Size (g)</label>
                <Input
                  id="portion"
                  type="number"
                  value={portionSize}
                  onChange={(e) => setPortionSize(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddFoodWithPortion} className="self-end">
                Add to Diary
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((food) => {
            const nutrients = extractNutrients(food);
            return (
              <Card
                key={food.fdcId}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  setSelectedFood(food);
                  setResults([]);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{nutrients.meal_name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {food.dataType.replace(/_/g, " ").toLowerCase()}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{nutrients.calories.toFixed(0)} cal</p>
                      <p className="text-muted-foreground">
                        P: {nutrients.protein_g.toFixed(0)}g • C: {nutrients.carbs_g.toFixed(0)}g • F: {nutrients.fat_g.toFixed(0)}g
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
