"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
	return (
		<div className="min-h-screen p-6 md:p-10">
			<div className="max-w-3xl mx-auto space-y-8">
				<div className="space-y-3">
					<h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Welcome</h1>
					<p className="text-muted-foreground">
						Preview URLs in device frames, create isometric galleries, and style screenshots with overlays and gradients. Choose a tool below to get started.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Isometric Gallery</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground">
								Create 3D isometric galleries with customizable layout, colors, and rotation.
							</p>
							<Link href="/isometric-gallery">
								<Button className="w-full">Open Isometric Gallery</Button>
							</Link>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Screen Decorator</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground">
								Preview any URL in different device sizes. Decorate with custom backgrounds and borders.
							</p>
							<Link href="/screen-decorator">
								<Button variant="outline" className="w-full">
									Open Screen Decorator
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
