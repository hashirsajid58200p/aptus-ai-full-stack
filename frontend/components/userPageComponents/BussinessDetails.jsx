import React, { useState, useEffect } from "react";
import { MdDeleteOutline, MdInfoOutline, MdOutlineEdit } from "react-icons/md";
import { FaRobot, FaCommentDots } from "react-icons/fa";
import {
  List,
  LayoutGrid,
  ChevronDown,
  Trash2,
  Plus,
  Pencil,
  RotateCw,
} from "lucide-react";
import { generateJSONContent } from "@/lib/groq";

import { CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "components/ui/dialog";

import { useDispatch, useSelector } from "react-redux";
import {
  addBusinessDetails,
  updateBusinessDetails,
  deleteBusinessDetails,
  loadUser,
  clearState,
} from "@/slices/userSlice";
import toast from "react-hot-toast";
import { AiFillThunderbolt } from "react-icons/ai";
import Loader from "../Loader";

const getRandomFallbackQuestions = (category, description) => {
  const pool = [
    {
      question: `What primary products or services does your business offer?`,
      answer: `We specialize in ${category || "our domain"} solutions tailored to customer requirements.`,
    },
    {
      question: `What are your standard business operating hours?`,
      answer: `We are open Monday through Friday, 9:00 AM to 6:00 PM.`,
    },
    {
      question: `How can customers reach customer support?`,
      answer: `You can reach our dedicated support team via our official website contact channels or email.`,
    },
    {
      question: `Do you offer custom pricing packages or consultations?`,
      answer: `Yes, we offer custom pricing depending on your specific requirements. Contact us for a quote.`,
    },
    {
      question: `What makes your business unique?`,
      answer: description || `We focus on delivering high-quality, customer-centric services with fast turnaround times.`,
    },
    {
      question: `What is your standard cancellation or return policy?`,
      answer: `We offer a customer-friendly return policy. Please check our terms for detailed steps.`,
    },
    {
      question: `How fast is the setup or onboarding process?`,
      answer: `Onboarding is quick and seamless, taking only a few simple steps to get started.`,
    },
    {
      question: `Do you provide post-launch support and maintenance?`,
      answer: `Yes, we provide ongoing maintenance and technical assistance to all active clients.`,
    },
    {
      question: `Are demo or trial options available?`,
      answer: `Yes, you can test out interactive features or request a walkthrough with our support team.`,
    },
    {
      question: `Where is your company located?`,
      answer: `We operate online with global accessibility and remote support for worldwide clients.`,
    }
  ];

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

const BusinessDetails = () => {
  const dispatch = useDispatch();
  const [layout, setLayout] = useState("carousel");
  const [carouselApi, setCarouselApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const {
    isBusinessDetailsAdded,
    isBusinessDetailsUpdated,
    isBusinessDetailsDeleted,
    user,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (!carouselApi) return;

    setScrollSnaps(carouselApi.scrollSnapList());
    setSelectedIndex(carouselApi.selectedScrollSnap());

    const onSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", () => {
      setScrollSnaps(carouselApi.scrollSnapList());
      setSelectedIndex(carouselApi.selectedScrollSnap());
    });

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Dynamic Q&A list state
  const [qaList, setQaList] = useState([
    { id: Date.now(), question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  // Edit Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    question: "",
    answer: "",
  });

  const handleAddField = () => {
    setQaList((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), question: "", answer: "" },
    ]);
  };

  const handleRemoveField = (id) => {
    if (qaList.length > 1) {
      setQaList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleFieldChange = (id, fieldName, value) => {
    setQaList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await dispatch(deleteBusinessDetails(id)).unwrap();
      toast.success("Business detail deleted successfully");
      await dispatch(loadUser());
    } catch (err) {
      toast.error(err?.message || "Failed to delete detail");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (detail) => {
    setEditFormData({
      id: detail._id,
      question: detail.question,
      answer: detail.answer,
    });
    setIsEditOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.question.trim() || !editFormData.answer.trim()) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        updateBusinessDetails({
          id: editFormData.id,
          question: editFormData.question,
          answer: editFormData.answer,
        })
      ).unwrap();
      toast.success("Business detail updated successfully");
      setIsEditOpen(false);
      await dispatch(loadUser());
    } catch (err) {
      toast.error(err?.message || "Failed to update detail");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validPairs = qaList.filter(
      (item) => item.question.trim() !== "" && item.answer.trim() !== ""
    );

    if (validPairs.length === 0) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      await dispatch(addBusinessDetails({ details: validPairs })).unwrap();
      toast.success("Business details added successfully");
      setQaList([{ id: Date.now(), question: "", answer: "" }]);
      await dispatch(loadUser());
    } catch (err) {
      toast.error(err?.message || "Failed to add business details");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    setGeneratedQuestions([]);
    const randomSeed = Math.floor(Math.random() * 100000);
    const businessDetails = `
      Business Name: ${user?.bussinessName || "N/A"},
      Business Category: ${user?.bussinessCategory || "N/A"},
      Business Description: ${user?.bussinessDescription || "N/A"}
    `;

    const prompt = `Generate exactly 5 NEW, unique, and creative questions for the following business from customer perspective (Variation Seed: ${randomSeed}): ${businessDetails}.
Make sure to generate fresh questions on diverse topics (e.g. pricing, support, features, policies, workflow).
Please return an array of exactly 5 questions in JSON format. Each question should be an object with "question" and "answer" properties. Format: [{"question": "...", "answer": "..."}]`;

    try {
      const questions = await generateJSONContent(prompt);

      if (Array.isArray(questions) && questions.length > 0) {
        setGeneratedQuestions(questions);
      } else if (questions?.content && Array.isArray(questions.content) && questions.content.length > 0) {
        setGeneratedQuestions(questions.content);
      } else {
        setGeneratedQuestions(getRandomFallbackQuestions(user?.bussinessCategory, user?.bussinessDescription));
      }
    } catch (error) {
      console.error("Error generating AI questions:", error);
      setGeneratedQuestions(getRandomFallbackQuestions(user?.bussinessCategory, user?.bussinessDescription));
    } finally {
      setLoading(false);
    }
  };

  const handlePickQuestion = (questionObj) => {
    setQaList((prev) => {
      const emptyIndex = prev.findIndex(
        (item) => !item.question.trim() && !item.answer.trim()
      );
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = {
          ...updated[emptyIndex],
          question: questionObj.question,
          answer: questionObj.answer,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            question: questionObj.question,
            answer: questionObj.answer,
          },
        ];
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    setGeneratedQuestions([]);
    toast.success("AI Question added to form!");
  };

  const handleDropdownToggle = (index) => {
    setSelectedQuestionIndex(selectedQuestionIndex === index ? null : index);
  };

  const handleToggleLayout = (selectedLayout) => {
    setLayout(selectedLayout);
  };

  useEffect(() => {
    if (
      isBusinessDetailsAdded ||
      isBusinessDetailsUpdated ||
      isBusinessDetailsDeleted
    ) {
      dispatch(loadUser());
      dispatch(clearState());
    }
  }, [
    isBusinessDetailsAdded,
    isBusinessDetailsUpdated,
    isBusinessDetailsDeleted,
    dispatch,
  ]);

  if (loading && generatedQuestions.length === 0 && qaList.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-gray-700">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl relative z-10 transform transition-transform">
        <CardHeader className="flex flex-row items-center justify-between p-6 space-y-0 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-bold text-gray-900 font-syne uppercase">
              Company Details
            </CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="p-1 text-[#1a1a1a] hover:text-[#FF4D00] transition-colors focus:outline-none"
                  title="How to provide business details"
                >
                  <MdInfoOutline className="text-2xl" />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-white text-gray-900 border rounded-xl p-6 shadow-2xl">
                <AlertDialogTitle className="text-lg font-semibold mb-2">
                  How to Provide Business Details
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  <p className="mb-4">
                    To help us train our models effectively, please provide
                    detailed answers to the following:
                  </p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>
                      Enter business-related questions in the "Company Related Question" field.
                    </li>
                    <li>Provide comprehensive answers in the "Answer" field.</li>
                  </ul>
                </AlertDialogDescription>
                <div className="mt-4 flex justify-end space-x-2">
                  <AlertDialogCancel className="btn-neo px-4 py-2 text-xs">
                    Close
                  </AlertDialogCancel>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Dynamic list of Questions and Answers */}
            <div className="space-y-6">
              {qaList.map((item, index) => (
                <div key={item.id} className="relative space-y-4 pt-2 border-b pb-4 last:border-b-0">
                  {qaList.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveField(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition font-bold"
                        title="Remove Question"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor={`question-${item.id}`}
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Company Related Question
                    </label>
                    <div className="relative">
                      <Input
                        id={`question-${item.id}`}
                        name="question"
                        value={item.question}
                        onChange={(e) =>
                          handleFieldChange(item.id, "question", e.target.value)
                        }
                        required
                        placeholder="What is our Company Objective?"
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) =>
                          (e.target.placeholder =
                            "What is our Company Objective?")
                        }
                        className="mt-2 block w-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring focus:ring-blue-500"
                      />
                      <FaRobot className="absolute right-3 top-3 text-xl text-[#FF4D00]" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`answer-${item.id}`}
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Answer
                    </label>
                    <div className="relative">
                      <Textarea
                        id={`answer-${item.id}`}
                        name="answer"
                        value={item.answer}
                        onChange={(e) =>
                          handleFieldChange(item.id, "answer", e.target.value)
                        }
                        required
                        placeholder="Our objective is to provide the best services to our customers..."
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) =>
                          (e.target.placeholder =
                            "Our objective is to provide the best services to our customers...")
                        }
                        rows={4}
                        className="mt-2 block w-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 resize-none max-h-40 overflow-y-auto"
                      />
                      <FaCommentDots className="absolute right-3 top-3 text-xl text-[#FF4D00]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Single Add Question Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleAddField}
                variant="outline"
                className="flex items-center gap-2 border-2 border-[#1a1a1a] bg-[#BFF000] text-[#1a1a1a] shadow-neo-sm font-extrabold"
              >
                <Plus className="w-5 h-5" /> Add Another Question
              </Button>
            </div>

            {/* Generate with AI Button */}
            <Button
              type="button"
              onClick={handleGenerateAI}
              disabled={loading}
              className="w-full btn-neo-secondary py-3 text-base flex items-center justify-center gap-2 font-extrabold"
            >
              <AiFillThunderbolt className="text-xl text-[#FF4D00]" />
              {loading ? "Generating Questions..." : "Generate with AI"}
            </Button>

            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF4D00]"></div>
              </div>
            )}

            {/* Display AI-generated Questions */}
            {generatedQuestions.length > 0 && (
              <div className="mt-6 p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] rounded-xl shadow-neo-sm">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[#1a1a1a] pb-3">
                  <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a] flex items-center gap-2">
                    <AiFillThunderbolt className="text-[#FF4D00] text-xl" />
                    AI-Generated Questions
                  </h3>
                  <Button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm text-xs font-extrabold hover:bg-[#a6d000] transition-colors"
                    title="Generate new questions"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </Button>
                </div>
                <div className="space-y-3">
                  {generatedQuestions.map((q, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-[#1a1a1a] p-4 rounded-lg shadow-neo-sm"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => handleDropdownToggle(index)}
                      >
                        <h4 className="font-extrabold text-sm text-[#1a1a1a]">{q.question}</h4>
                        <span className="text-[#FF4D00] font-black text-sm">
                          {selectedQuestionIndex === index ? "▲" : "▼"}
                        </span>
                      </div>
                      {selectedQuestionIndex === index && (
                        <div className="mt-3 pt-2 border-t border-gray-200 text-xs font-medium text-gray-700 leading-relaxed">
                          {q.answer}
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={() => handlePickQuestion(q)}
                        className="mt-3 btn-neo-primary px-3 py-1 text-xs font-extrabold"
                      >
                        Select Question
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full btn-neo-primary py-3 text-base font-extrabold"
            >
              SUBMIT BUSINESS DETAILS
            </Button>
          </form>
        </CardContent>
      </div>

      {/* Floating Carousel / Accordion List */}
      <div className="w-full max-w-4xl mt-8">
        <div className="p-4">
          {/* Layout Toggle Icons */}
          <div className="flex justify-end mb-4 space-x-4">
            <LayoutGrid
              onClick={() => handleToggleLayout("carousel")}
              className={`cursor-pointer text-gray-500 hover:text-blue-500 transition ${
                layout === "carousel" ? "text-blue-500" : ""
              }`}
              size={24}
            />
            <List
              onClick={() => handleToggleLayout("accordion")}
              className={`cursor-pointer text-gray-500 hover:text-blue-500 transition ${
                layout === "accordion" ? "text-blue-500" : ""
              }`}
              size={24}
            />
          </div>

          {/* Conditionally render based on selected layout */}
          {layout === "carousel" ? (
            <div className="w-full max-w-4xl mt-8">
              <Carousel
                setApi={setCarouselApi}
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
                className="rounded-xl shadow-xl overflow-hidden relative"
              >
                <CarouselContent>
                  {user?.bussinessDetails?.map((item, index) => (
                    <CarouselItem key={item._id || index}>
                      <div className="relative p-6 bg-white text-gray-800 rounded-xl max-h-[35vh] min-h-[35vh]">
                        <div className="h-full relative group">
                          <CardHeader className="flex flex-row items-center gap-3">
                            <FaRobot className="text-2xl text-[#FF4D00] shrink-0" />
                            <CardTitle className="text-lg">
                              {item.question}
                            </CardTitle>
                            <div className="ml-auto flex items-center gap-1 shrink-0">
                              {/* Edit Icon */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-2 text-[#1a1a1a] hover:text-[#FF4D00] transition-all"
                                title="Edit"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>

                              {/* Delete Icon */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="p-2 text-red-500 hover:text-red-700 transition-all">
                                    <MdDeleteOutline className="text-2xl" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white text-gray-900 border rounded-xl p-6 shadow-2xl">
                                  <AlertDialogTitle className="text-lg font-semibold mb-2">
                                    Delete Confirmation
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600">
                                    Are you sure you want to delete this business detail?
                                  </AlertDialogDescription>
                                  <div className="mt-4 flex justify-end space-x-2">
                                    <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-4 py-2 rounded-lg">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(item._id)}
                                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <p>{item.answer}</p>
                          </CardContent>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              {user?.bussinessDetails?.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => carouselApi?.scrollTo(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        index === selectedIndex ? "bg-[#FF4D00]" : "bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="accordion space-y-4">
              {user?.bussinessDetails?.map((detail, index) => (
                <div key={detail._id || index} className="border rounded-lg bg-white">
                  <div
                    onClick={() => {
                      const panel = document.getElementById(`panel-${index}`);
                      if (panel) panel.classList.toggle("hidden");
                    }}
                    className="flex px-4 py-2 bg-gray-50 rounded-t-lg hover:bg-gray-100 cursor-pointer items-center justify-between"
                  >
                    <button className="w-full text-left font-medium text-gray-800">
                      {detail.question}
                    </button>
                    <span className="flex gap-3 items-center shrink-0">
                      <Pencil
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(detail);
                        }}
                        className="w-4 h-4 text-[#1a1a1a] hover:text-[#FF4D00] cursor-pointer"
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Trash2
                            onClick={(e) => e.stopPropagation()}
                            color="red"
                            className="w-4 h-4 cursor-pointer z-50"
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-gray-900 border rounded-xl p-6 shadow-2xl">
                          <AlertDialogTitle className="text-lg font-semibold mb-2">
                            Delete Confirmation
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to delete this detail?
                          </AlertDialogDescription>
                          <div className="mt-4 flex justify-end space-x-2">
                            <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-4 py-2 rounded-lg">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(detail._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </span>
                  </div>
                  <div
                    id={`panel-${index}`}
                    className="px-4 py-2 bg-gray-50 hidden rounded-b-lg border-t-2"
                  >
                    <p>{detail.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Aligned with theme) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white text-gray-900 max-w-lg rounded-xl p-6 shadow-2xl border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MdOutlineEdit className="text-[#FF4D00] text-2xl" /> Edit Question & Answer
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Update the question and answer for your chatbot's training context.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="edit-question" className="block text-sm font-medium text-gray-700">
                Company Related Question
              </label>
              <div className="relative">
                <Input
                  id="edit-question"
                  value={editFormData.question}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  required
                  className="mt-2 block w-full border border-gray-200 bg-white text-gray-900 focus:ring focus:ring-blue-500"
                />
                <FaRobot className="absolute right-3 top-3 text-xl text-[#FF4D00]" />
              </div>
            </div>

            <div>
              <label htmlFor="edit-answer" className="block text-sm font-medium text-gray-700">
                Answer
              </label>
              <div className="relative">
                <Textarea
                  id="edit-answer"
                  value={editFormData.answer}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      answer: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                  className="mt-2 block w-full border border-gray-200 bg-white text-gray-900 resize-none max-h-40 overflow-y-auto"
                />
                <FaCommentDots className="absolute right-3 top-3 text-xl text-[#FF4D00]" />
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-neo-primary font-extrabold px-5 py-2 text-sm"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDetails;
