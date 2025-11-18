"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import AddCompanyDialog from "@/components/AddCompanyDialog";

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    location: "",
    size: "",
    type: "",
    sort: "name",
    page: 1,
  });

  // Debounced fetch function (only triggers after user stops typing for 300ms)
  const debouncedFetch = useCallback(
    debounce(() => {
      fetchCompanies();
    }, 300),
    [filters] // Re-create only when filters change (except search)
  );

  const fetchCompanies = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: "10",
      search: filters.search,
      industry: filters.industry,
      location: filters.location,
      size: filters.size,
      type: filters.type,
      sort: filters.sort,
    });

    const res = await fetch(`/api/companies?${params}`);
    const data = await res.json();
    setCompanies(data.companies || []);
    setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
    setLoading(false);
  };

  // Fetch immediately on filter changes (except search)
  useEffect(() => {
    if (filters.search === "" || filters.search.length >= 2) {
      fetchCompanies();
    }
  }, [filters.industry, filters.location, filters.size, filters.type, filters.sort, filters.page]);

  // Debounced search only
  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel(); // Cleanup on unmount
  }, [filters.search]);

  // Helper for "All" in selects
  const displayValue = (value) => (value === "" ? "all" : value);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Companies Directory</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage companies
          </p>
        </div>
        <AddCompanyDialog onSuccess={fetchCompanies}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Company
          </Button>
        </AddCompanyDialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Search - Debounced */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              className="pl-10"
            />
          </div>

          {/* Industry */}
          <Select
            value={displayValue(filters.industry)}
            onValueChange={(v) =>
              setFilters({ ...filters, industry: v === "all" ? "" : v, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
            </SelectContent>
          </Select>

          {/* Location */}
          <Select
            value={displayValue(filters.location)}
            onValueChange={(v) =>
              setFilters({ ...filters, location: v === "all" ? "" : v, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Austin, TX">Austin, TX</SelectItem>
              <SelectItem value="Cupertino, CA">Cupertino, CA</SelectItem>
              <SelectItem value="Mountain View, CA">Mountain View, CA</SelectItem>
              <SelectItem value="Redmond, WA">Redmond, WA</SelectItem>
              <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
              <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
              <SelectItem value="Hawthorne, CA">Hawthorne, CA</SelectItem>
              <SelectItem value="Menlo Park, CA">Menlo Park, CA</SelectItem>
              <SelectItem value="Los Gatos, CA">Los Gatos, CA</SelectItem>
              <SelectItem value="Santa Clara, CA">Santa Clara, CA</SelectItem>
              <SelectItem value="San Jose, CA">San Jose, CA</SelectItem>
              <SelectItem value="Ottawa, Canada">Ottawa, Canada</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Stockholm, Sweden">Stockholm, Sweden</SelectItem>
              <SelectItem value="Sydney, Australia">Sydney, Australia</SelectItem>
              <SelectItem value="Bozeman, MT">Bozeman, MT</SelectItem>
              <SelectItem value="London, UK">London, UK</SelectItem>
              <SelectItem value="New York, NY">New York, NY</SelectItem>
              <SelectItem value="Toronto, Canada">Toronto, Canada</SelectItem>
              <SelectItem value="Amsterdam, Netherlands">Amsterdam, Netherlands</SelectItem>
              <SelectItem value="Berlin, Germany">Berlin, Germany</SelectItem>
            </SelectContent>
          </Select>

          {/* Size */}
          <Select
            value={displayValue(filters.size)}
            onValueChange={(v) =>
              setFilters({ ...filters, size: v === "all" ? "" : v, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="1-10">1-10</SelectItem>
              <SelectItem value="11-50">11-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201-500">201-500</SelectItem>
              <SelectItem value="500+">500+</SelectItem>
            </SelectContent>
          </Select>

          {/* Type */}
          <Select
            value={displayValue(filters.type)}
            onValueChange={(v) =>
              setFilters({ ...filters, type: v === "all" ? "" : v, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Non-Profit">Non-Profit</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={filters.sort}
            onValueChange={(v) => setFilters({ ...filters, sort: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="createdAt">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table & Pagination - unchanged */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : companies.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No companies found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-xs font-bold">
                            {company.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{company.name}</div>
                          {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
                              {company.website.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell><Badge variant="secondary">{company.size}</Badge></TableCell>
                    <TableCell><Badge>{company.type}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (filters.page > 1) setFilters({ ...filters, page: filters.page - 1 });
                }}
                className={filters.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {[...Array(pagination.pages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === filters.page}
                  onClick={(e) => {
                    e.preventDefault();
                    setFilters({ ...filters, page: i + 1 });
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (filters.page < pagination.pages) setFilters({ ...filters, page: filters.page + 1 });
                }}
                className={filters.page === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}