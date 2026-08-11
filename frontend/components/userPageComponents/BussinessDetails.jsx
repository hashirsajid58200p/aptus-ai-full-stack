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
  const categoryName = category || "our domain";
  const desc = description || "our products and services";

  const questionPools = [
    {
      q: [
        `What primary services or products does your business offer in ${categoryName}?`,
        `Can you provide an overview of your main ${categoryName} solutions?`,
        `What key offerings do you specialize in for ${categoryName}?`,
      ],
      a: [
        `We provide comprehensive ${categoryName} solutions tailored to customer requirements. ${desc}`,
        `Our team specializes in top-tier ${categoryName} designed for quality and reliability.`,
        `We offer end-to-end ${categoryName} services focused on customer satisfaction.`,
      ],
    },
    {
      q: [
        `What are your standard business operating hours?`,
        `When is customer support available during the week?`,
        `What hours can clients contact your support team?`,
      ],
      a: [
        `Our support team is available Monday through Friday, from 9:00 AM to 6:00 PM EST.`,
        `We operate Monday to Friday during standard business hours with online support.`,
        `Customer support is active 5 days a week from 9 AM to 6 PM EST.`,
      ],
    },
    {
      q: [
        `How can customers contact your team for support or inquiries?`,
        `What is the best way to reach your sales or support channel?`,
        `Do you have an official contact method for general questions?`,
      ],
      a: [
        `You can reach us directly via our website contact form or official email support channel.`,
        `Our support team responds promptly through our official website contact channels.`,
        `Feel free to message us anytime through our website contact form or support portal.`,
      ],
    },
    {
      q: [
        `Do you offer custom pricing packages or consultations?`,
        `Are there flexible pricing plans tailored for different business needs?`,
        `How does pricing work for custom project requests?`,
      ],
      a: [
        `Yes! We offer customized plans and consultations based on your specific requirements.`,
        `We provide flexible options to suit businesses of all sizes. Contact us for a custom quote.`,
        `Our pricing is adaptable to your exact project scope and required features.`,
      ],
    },
    {
      q: [
        `What makes your company stand out from competitors?`,
        `Why should clients choose your ${categoryName} solutions?`,
        `What is the core mission and unique value of your business?`,
      ],
      a: [
        `We combine high quality, fast response times, and tailored solutions for client success.`,
        `Our emphasis on reliability, customer satisfaction, and custom solutions sets us apart.`,
        `We pride ourselves on high quality standards, clear communication, and dedicated service.`,
      ],
    },
    {
      q: [
        `How long does the setup or onboarding process take?`,
        `What can new customers expect during initial onboarding?`,
        `Is it easy to get started with your ${categoryName}?`,
      ],
      a: [
        `Getting started is quick and seamless — onboarding usually takes just a few simple steps!`,
        `Our streamlined onboarding process ensures you get up and running smoothly without friction.`,
        `We guide you step-by-step to ensure rapid setup without technical complexity.`,
      ],
    },
    {
      q: [
        `Do you provide technical support and maintenance after purchase?`,
        `What post-launch assistance do you offer to clients?`,
        `Will I get regular maintenance and support after signing up?`,
      ],
      a: [
        `Yes, we provide ongoing technical support and maintenance to ensure optimal performance.`,
        `Our team remains available for post-setup support and answering technical questions.`,
        `We stand by our clients with reliable ongoing assistance whenever needed.`,
      ],
    },
    {
      q: [
        `What is your policy regarding returns, refunds, or cancellations?`,
        `Are clients able to modify or cancel their subscription plan?`,
        `Do you offer transparent refund and cancellation terms?`,
      ],
      a: [
        `We maintain a transparent policy — you can contact support for plan changes or refund info.`,
        `We prioritize customer satisfaction and provide straightforward terms for plan adjustments.`,
        `Our policy is built on transparency. Please review our terms or contact support for help.`,
      ],
    },
  ];

  const shuffledPools = [...questionPools].sort(() => Math.random() - 0.5);

  return shuffledPools.slice(0, 5).map((item) => {
    const qIndex = Math.floor(Math.random() * item.q.length);
    const aIndex = Math.floor(Math.random() * item.a.length);
    return {
      question: item.q[qIndex],
      answer: item.a[aIndex],
    };
  });
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
    const randomSeed = Math.floor(Math.random() * 1000000);
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
      <div className="flex justify-center items-center h-screen bg-[#FDF9F0]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-[#1a1a1a]">
      {/* Neo-brutalist Company Details Card with Sharp Edges */}
      <div className="bg-white w-full max-w-4xl border-3 border-[#1a1a1a] shadow-neo-lg relative z-10">
        <CardHeader className="flex flex-row items-center justify-between p-6 space-y-0 border-b-3 border-[#1a1a1a] bg-white">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-semibold text-black-500">
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

              <AlertDialogContent className="bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] p-6 shadow-neo-lg">
                <AlertDialogTitle className="text-lg font-bold uppercase text-[#1a1a1a] mb-2">
                  How to Provide Business Details
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-700 font-medium text-sm">
                  <p className="mb-4">
                    To help us train our AI model effectively, please provide
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
                  <AlertDialogCancel className="btn-neo px-5 py-2 text-xs font-extrabold uppercase">
                    Close
                  </AlertDialogCancel>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Dynamic list of Questions and Answers */}
            <div className="space-y-6">
              {qaList.map((item, index) => (
                <div key={item.id} className="relative space-y-4 pt-2 border-b-2 border-gray-200 pb-6 last:border-b-0">
                  {qaList.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveField(item.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 transition"
                        title="Remove Question"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor={`question-${item.id}`}
                      className="block text-xs font-black uppercase text-[#1a1a1a] mb-1"
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
                        className="mt-1 block w-full border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm py-2.5 pl-3 pr-10"
                      />
                      <FaRobot className="absolute right-3 top-3.5 text-xl text-[#FF4D00]" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`answer-${item.id}`}
                      className="block text-xs font-black uppercase text-[#1a1a1a] mb-1"
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
                        className="mt-1 block w-full border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm resize-none max-h-40 overflow-y-auto py-2.5 pl-3 pr-10"
                      />
                      <FaCommentDots className="absolute right-3 top-3.5 text-xl text-[#FF4D00]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Single Add Question Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleAddField}
                variant="outline"
                className="flex items-center gap-2 border-2 border-[#1a1a1a] bg-[#BFF000] text-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:bg-[#a6d000] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Another Question
              </Button>
            </div>

            {/* Generate with AI Button */}
            <Button
              type="button"
              onClick={handleGenerateAI}
              disabled={loading}
              className="w-full btn-neo-secondary py-3 text-sm uppercase flex items-center justify-center gap-2 font-extrabold shadow-neo-sm"
            >
              <AiFillThunderbolt className="text-xl text-[#FF4D00]" />
              {loading ? "Generating Questions..." : "Generate with AI"}
            </Button>

            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF4D00]"></div>
              </div>
            )}

            {/* Display AI-generated Questions with Sharp Edges & Original Clean Font */}
            {generatedQuestions.length > 0 && (
              <div className="mt-6 p-5 border-3 border-[#1a1a1a] bg-[#FDF9F0] shadow-neo-sm space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
                  <h3 className="text-base font-bold uppercase text-[#1a1a1a] flex items-center gap-2">
                    <AiFillThunderbolt className="text-[#FF4D00] text-xl" />
                    AI-Generated Questions
                  </h3>
                  <Button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm text-xs font-extrabold uppercase hover:bg-[#a6d000] transition-colors cursor-pointer"
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
                      className="bg-white border-2 border-[#1a1a1a] p-4 shadow-neo-sm"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => handleDropdownToggle(index)}
                      >
                        <h4 className="font-semibold text-sm text-[#1a1a1a]">{q.question}</h4>
                        <span className="text-[#FF4D00] font-black text-sm ml-2">
                          {selectedQuestionIndex === index ? "▲" : "▼"}
                        </span>
                      </div>
                      {selectedQuestionIndex === index && (
                        <div className="mt-3 pt-2 border-t-2 border-gray-100 text-xs font-normal text-gray-700 leading-relaxed">
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
              className="w-full btn-neo-primary py-3.5 text-base font-extrabold uppercase shadow-neo-sm"
            >
              SUBMIT BUSINESS DETAILS
            </Button>
          </form>
        </CardContent>
      </div>

      {/* Floating Carousel / Accordion List with Sharp Edges & Clean Original Fonts */}
      <div className="w-full max-w-4xl mt-8">
        <div className="p-2">
          {/* Layout Toggle Icons */}
          <div className="flex justify-end mb-4 gap-2">
            <button
              type="button"
              onClick={() => handleToggleLayout("carousel")}
              className={`p-2 border-2 border-[#1a1a1a] transition-all cursor-pointer ${
                layout === "carousel"
                  ? "bg-[#FF4D00] text-white shadow-neo-sm"
                  : "bg-white text-[#1a1a1a] hover:bg-[#BFF000]"
              }`}
              title="Carousel View"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleToggleLayout("accordion")}
              className={`p-2 border-2 border-[#1a1a1a] transition-all cursor-pointer ${
                layout === "accordion"
                  ? "bg-[#FF4D00] text-white shadow-neo-sm"
                  : "bg-white text-[#1a1a1a] hover:bg-[#BFF000]"
              }`}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>

          {/* Conditionally render based on selected layout */}
          {layout === "carousel" ? (
            <div className="w-full max-w-4xl">
              <Carousel
                setApi={setCarouselApi}
                plugins={[
                  Autoplay({
                    delay: 3500,
                  }),
                ]}
                className="overflow-hidden relative"
              >
                <CarouselContent>
                  {user?.bussinessDetails?.map((item, index) => (
                    <CarouselItem key={item._id || index}>
                      <div className="relative p-6 bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo max-h-[38vh] min-h-[38vh] flex flex-col justify-between">
                        <div className="h-full relative flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 pb-3 border-b-2 border-[#1a1a1a] mb-3">
                              <FaRobot className="text-2xl text-[#FF4D00] shrink-0" />
                              <CardTitle className="text-base sm:text-lg font-bold text-[#1a1a1a] flex-1">
                                {item.question}
                              </CardTitle>
                              <div className="ml-auto flex items-center gap-2 shrink-0">
                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(item)}
                                  className="p-2 bg-[#BFF000] border-2 border-[#1a1a1a] text-[#1a1a1a] shadow-neo-sm hover:translate-x-[-1px] transition-all cursor-pointer"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                {/* Delete Button */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button
                                      type="button"
                                      className="p-2 bg-red-600 border-2 border-[#1a1a1a] text-white shadow-neo-sm hover:translate-x-[-1px] transition-all cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] p-6 shadow-neo-lg">
                                    <AlertDialogTitle className="text-lg font-bold uppercase text-[#1a1a1a] mb-2">
                                      Delete Confirmation
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-700 font-bold text-sm">
                                      Are you sure you want to delete this business detail?
                                    </AlertDialogDescription>
                                    <div className="mt-6 flex justify-end space-x-3">
                                      <AlertDialogCancel className="bg-gray-100 text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] px-4 py-2 text-xs uppercase hover:bg-gray-200">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-600 text-white font-extrabold border-2 border-[#1a1a1a] shadow-neo-sm px-4 py-2 text-xs uppercase hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </div>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>

                            <div className="pt-1">
                              <p className="text-sm font-normal text-gray-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
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
                      className={`h-3 w-3 border-2 border-[#1a1a1a] transition-all cursor-pointer ${
                        index === selectedIndex
                          ? "bg-[#FF4D00] scale-110 shadow-neo-sm"
                          : "bg-white"
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
                <div key={detail._id || index} className="border-3 border-[#1a1a1a] shadow-neo-sm bg-white overflow-hidden">
                  <div
                    onClick={() => {
                      const panel = document.getElementById(`panel-${index}`);
                      if (panel) panel.classList.toggle("hidden");
                    }}
                    className="flex px-5 py-3.5 bg-white text-[#1a1a1a] hover:bg-[#FDF9F0] cursor-pointer items-center justify-between border-b-2 border-[#1a1a1a]"
                  >
                    <button className="w-full text-left font-bold text-sm text-[#1a1a1a]">
                      {detail.question}
                    </button>
                    <span className="flex gap-2 items-center shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(detail);
                        }}
                        className="p-1.5 bg-[#BFF000] border-2 border-[#1a1a1a] text-[#1a1a1a] shadow-neo-sm hover:translate-x-[-1px] transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-red-600 border-2 border-[#1a1a1a] text-white shadow-neo-sm hover:translate-x-[-1px] transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] p-6 shadow-neo-lg">
                          <AlertDialogTitle className="text-lg font-bold uppercase text-[#1a1a1a] mb-2">
                            Delete Confirmation
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-700 font-bold text-sm">
                            Are you sure you want to delete this detail?
                          </AlertDialogDescription>
                          <div className="mt-6 flex justify-end space-x-3">
                            <AlertDialogCancel className="bg-gray-100 text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] px-4 py-2 text-xs uppercase hover:bg-gray-200">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(detail._id)}
                              className="bg-red-600 text-white font-extrabold border-2 border-[#1a1a1a] shadow-neo-sm px-4 py-2 text-xs uppercase hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                      <ChevronDown className="w-5 h-5 text-[#1a1a1a] ml-1" />
                    </span>
                  </div>
                  <div
                    id={`panel-${index}`}
                    className="px-5 py-4 bg-[#FDF9F0] text-gray-700 font-normal text-sm border-t-2 border-[#1a1a1a] leading-relaxed"
                  >
                    <p>{detail.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Sharp Edges & Clean Fonts) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white text-[#1a1a1a] max-w-lg border-3 border-[#1a1a1a] shadow-neo-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase text-[#1a1a1a] flex items-center gap-2">
              <MdOutlineEdit className="text-[#FF4D00] text-2xl" /> Edit Question & Answer
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-gray-600">
              Update the question and answer for your chatbot's training context.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="edit-question" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
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
                  className="mt-1 block w-full border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm py-2.5 pl-3 pr-10"
                />
                <FaRobot className="absolute right-3 top-3.5 text-xl text-[#FF4D00]" />
              </div>
            </div>

            <div>
              <label htmlFor="edit-answer" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
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
                  className="mt-1 block w-full border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm resize-none max-h-40 overflow-y-auto py-2.5 pl-3 pr-10"
                />
                <FaCommentDots className="absolute right-3 top-3.5 text-xl text-[#FF4D00]" />
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2 pt-4 border-t-2 border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="bg-gray-100 text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] px-4 py-2 text-xs uppercase hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-neo-primary font-extrabold px-5 py-2 text-xs uppercase shadow-neo-sm"
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
